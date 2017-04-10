import DS from 'ember-data';
import Ember from 'ember';
BigNumber.config({DECIMAL_PLACES: 25});
export default DS.Model.extend({

  /**
   * createdAt represents the creation date of the splits, will be stored in database
   * and should be set on create
   *
   * @type {Date}
   */
  createdAt: DS.attr('date', {
    defaultValue() { return new Date(); }
  }),

  /**
   * updatedAt represents the updating date of the splits, will be stored in database
   * and should be set on create on on every page visit
   *
   * @type {Date}
   */
  updatedAt: DS.attr('date', {
    defaultValue() { return new Date(); }
  }),

  run: DS.belongsTo('run'),

  splitDistance : new BigNumber(1000),

  /**
   * What is the spliting strategy? negative, positive or even?
   *
   * @return {BigNumber} percentage value, describing how much faster the first half of the run should be. Can also be negative, which results in a positive split
   */
  splittingStrategy : new BigNumber(0),

  /**
   * reverse splitting strategy for the second half of the run
   *
   * @return {BigNumber} negative percantage value of splittingStrategy
   */
  splittingStrategySecondHalf: Ember.computed("splittingStrategy", function(){
    return this.get("splittingStrategy").times(-1);
  }),

  /**
   * Number of splits (decimal)
   *
   * @return {BigNumber} number of splits
   */
  splitCount: Ember.computed("run.lengthM", "splitDistance", function(){
    return this.get("run.lengthM").dividedBy(this.get("splitDistance"));
  }),

  /**
   * Number of splits (ceiled)
   *
   * @return {BigNumber} ceiled number of splits
   */
  splitCountCeiled: Ember.computed("splitCount", function(){
    return this.get("splitCount").ceil();
  }),

  /**
   * Reflects the length of the last split if the run is not even divisible by its split count
   *
   * @return {BigNumber} length of the last split in meter, somewhere between 0 and splitDistance
   */
  lastSplitDistance: Ember.computed("run.lengthM", "splitDistance", "splitCountCeiled", function(){
    return this.get("run.lengthM").minus(this.get("splitDistance").times(this.get("splitCountCeiled").minus(1)));
  }),

  /**
   * Split number where the turning point is placed. When the turning point is exactly
   * between two splits this number will be the first of the two
   *
   * @return {BigNumber} number of the turning point split
   */
  turningPointSplit: Ember.computed("splitCountCeiled", function(){
    return this.get("splitCountCeiled").dividedBy(2).ceil();
  }),

  /**
   * Exact turning point position in meter
   *
   * @return {BigNumber} position in meter
   */
  turningPointM: Ember.computed("run.lengthM", function(){
    return this.get("run.lengthM").dividedBy(2);
  }),

  /**
   * Describes, whether the turning point is placed within a split or exactly at the border between two splits
   *
   * @return {Boolean}
   */
  turningPointWithinSplit: Ember.computed("splitCount", function(){
    return this.get("splitCount")%2 === 0 ? false : true;
  }),

  /**
   * Assuming an even pacing, this property describes the time needed for a whole split
   *
   * @return {BigNumber} split time in seconds
   */
  splitTime: Ember.computed("run.timeSec", "splitCount", function(){
    return this.get("run.timeSec").dividedBy(this.get("splitCount"));
  }),

  /**
   * Assuming an even pacing, this property describes the time needed for the last split
   *
   * @return {BigNumber} last split time in seconds
   */
  lastSplitTime: Ember.computed("run.timeSec", "splitTime", "splitCountCeiled", function(){
    return this.get("run.timeSec").minus(this.get("splitTime").times(this.get("splitCountCeiled").minus(1)));
  }),

  /**
   * Average pace of the first half
   *
   * @return {BigNumber} average pace in min/km
   */
  averagePaceFirstHalf: Ember.computed("run.paceMinPerKmRaw", "run.paceMinPerKmRaw", "splittingStrategy", function(){
    return this.get("run.paceMinPerKmRaw").plus(this.get("run.paceMinPerKmRaw").times(this.get("splittingStrategy")).dividedBy(100));
  }),

  /**
   * Average pace of the second half
   *
   * @return {BigNumber} average pace in min/km
   */
  averagePaceSecondHalf: Ember.computed("run.paceMinPerKmRaw", "run.paceMinPerKmRaw", "splittingStrategySecondHalf", function(){
    return this.get("run.paceMinPerKmRaw").plus(this.get("run.paceMinPerKmRaw").times(this.get("splittingStrategySecondHalf")).dividedBy(100));
  }),


  /**
   * peak pace value of the race, a lower number means to be faster
   *
   * @return {BigNumber} peak pace in min/km
   */
  peakPaceValue: Ember.computed("averagePaceFirstHalf", "averagePaceSecondHalf", "splittingStrategy", "run.lengthKmRaw", "slope", "shift", function(){
    if(this.get("evenSlope")===false){
      // get the average pace of the fastes half
      return this.get("splittingStrategy").greaterThan(0) ? this.get("averagePaceSecondHalf") : this.get("averagePaceFirstHalf");
    }else{
      // get the average pace of first or last meter of the race
      var x = this.get("splittingStrategy").greaterThan(0) ? new BigNumber(0) : this.get("run.lengthKmRaw");
      return x.times(this.get("slope")).plus(this.get("shift"));
    }
  }),

  /**
   * Wheter to use a gradually increasing pace (even slope) or just change the pace once at the turning point
   *
   * @return {Boolean}
   */
  evenSlope : false,

  /**
   * Slope of the pace when evenSlope is requested
   *
   * @return {BigNumber}
   */
  slope: Ember.computed("averagePaceFirstHalf", "averagePaceSecondHalf", "run.lengthKmRaw", function(){
    // like in https://en.wikipedia.org/wiki/Slope
    var a = this.get("averagePaceFirstHalf").minus(this.get("averagePaceSecondHalf"));
    var b = this.get("run.lengthKmRaw").dividedBy(4).minus(this.get("run.lengthKmRaw").dividedBy(4).times(3));
    return a.dividedBy(b);
  }),

  /**
   * Shift of the pace when evenSlope is requested
   *
   * @return {BigNumber}
   */
  shift: Ember.computed("averagePaceFirstHalf", "slope", "run.lengthKmRaw", function(){
    // calculared by using https://en.wikipedia.org/wiki/Equation
    return this.get("averagePaceFirstHalf").minus(this.get("slope").times(this.get("run.lengthKmRaw").dividedBy(4)));
  }),

  /**
   * array of objects describing the splits of a run
   *
   * @return {Array} array of splits
   * @return {Array.split<Run>} a specific run object containing the split
   * @return {Array.run<Run>} a specific run object from the beginning of the run to the end of the current split
   * @return {Array.progressDistance<String>} distance progress at the end of the current split, in percent
   * @return {Array.progressTime<String>} time progress at the end of the current split, in percent
   * @return {Array.progressPace<String>} pace progress at the end of the current split, in percent
   */
  splits: [],

  /**
   * calcluates the splits and sets the splits array
   *
   * @return {Boolean}
   */
  calculateSplits: function(){
    this.get("splits").clear();

    var lengthMStack = new BigNumber(0); // how long is the entire run until the current split
    var timeSecStack = new BigNumber(0); // how much time of the entire run until the current split

    if(this.get("splitCountCeiled").greaterThan(1) === true){
      for (let i = 1; this.get("splitCountCeiled").greaterThanOrEqualTo(i); i++) {
        var thisSplitDistance = this.get("splitCountCeiled").equals(i) ? this.get("lastSplitDistance") : this.get("splitDistance"); // different length for last split

        var beforeTurningPoint = this.get("turningPointSplit").greaterThanOrEqualTo(i); // are we in a split that is before the turning point
        var thisSplitTime = this.get("splitCountCeiled").equals(i) ? this.get("lastSplitTime") : this.get("splitTime"); // different time for last split

        var averagePaceCurrent;
        if(this.get("evenSlope") === true){
          // get the average pace from the middle of the current split
          averagePaceCurrent = lengthMStack.plus(thisSplitDistance.dividedBy(2)).dividedBy(1000).times(this.get("slope")).plus(this.get("shift"));
        }else{
          averagePaceCurrent = beforeTurningPoint ? this.get("averagePaceFirstHalf") : this.get("averagePaceSecondHalf");
        }

        lengthMStack = lengthMStack.plus(thisSplitDistance);
        // apply splitting strategy
        // check if this run has a turning point somewhere in the middle of a split and if this is the current one
        // also check if no evenSlope is requested and the turning point is not needed
        if(this.get("turningPointWithinSplit") === true && this.get("turningPointSplit").equals(i) && this.get("evenSlope") === false){
          var turningPointSplitDistance = this.get("turningPointM").minus(this.get("splitDistance").times(i-1));
          // determine the ratio between pre and post turning point distance
          var turningPointSplitRatio1 = turningPointSplitDistance.dividedBy(this.get("splitDistance")).times(100);
          var turningPointSplitRatio2 = new BigNumber(100).minus(turningPointSplitRatio1);
          // determine the time of both splitting strategies
          var thisSplitTime1 = this.get("averagePaceFirstHalf").times(60).times(thisSplitDistance.dividedBy(1000));
          var thisSplitTime2 = this.get("averagePaceSecondHalf").times(60).times(thisSplitDistance.dividedBy(1000));
          // sum both times according to their ratio
          var time1 = thisSplitTime1.times(turningPointSplitRatio1).dividedBy(100);
          var time2 = thisSplitTime2.times(turningPointSplitRatio2).dividedBy(100);
          thisSplitTime = time1.plus(time2);
        }else{
          thisSplitTime = averagePaceCurrent.times(60).times(thisSplitDistance.dividedBy(1000));
        }

        timeSecStack = timeSecStack.plus(thisSplitTime);
        var progressDistance = lengthMStack.dividedBy(this.get("run.lengthM")).times(100);
        var progressTime = timeSecStack.dividedBy(this.get("run.timeSec")).times(100);

        this.get("splits").push(Ember.Object.create({
          'split' : this.store.createRecord('run', {
            timeSec : thisSplitTime.round(20),
            lengthM : thisSplitDistance.round(20)
          }),
          'run' : this.store.createRecord('run', {
            timeSec : timeSecStack.round(20),
            lengthM : lengthMStack.round(20)
          }),
          'progressDistance' : progressDistance,
          'progressTime' : progressTime
        }));
      }
      return true;
    }else{
      return false;
    }
  },


  /**
   * update updatedAt before saving the settings
   */
  save: function(){
    this.set("updatedAt", new Date());
    this._super(...arguments);
  },
});
