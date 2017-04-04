import DS from 'ember-data';
import Ember from 'ember';
BigNumber.config({DECIMAL_PLACES: 25});
export default DS.Model.extend({
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
  splitCount: Ember.computed("run.content.lengthM", "splitDistance", function(){
    return this.get("run.content.lengthM").dividedBy(this.get("splitDistance"));
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
   * Reflects the lenght of the last split if the run is not even divisible by its split count
   *
   * @return {BigNumber} lenght of the last split in meter, somewhere between 0 and splitDistance
   */
  lastSplitDistance: Ember.computed("run.content.lengthM", "splitDistance", "splitCountCeiled", function(){
    return this.get("run.content.lengthM").minus(this.get("splitDistance").times(this.get("splitCountCeiled").minus(1)));
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
  turningPointM: Ember.computed("run.content.lengthM", function(){
    return this.get("run.content.lengthM").dividedBy(2);
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
  splitTime: Ember.computed("run.content.timeSec", "splitCount", function(){
    return this.get("run.content.timeSec").dividedBy(this.get("splitCount"));
  }),

  /**
   * Assuming an even pacing, this property describes the time needed for the last split
   *
   * @return {BigNumber} last split time in seconds
   */
  lastSplitTime: Ember.computed("run.content.timeSec", "splitTime", "splitCountCeiled", function(){
    console.log(this.get("run.content.timeSec").minus(this.get("splitTime").times(this.get("splitCountCeiled").minus(1))).toString());
    return this.get("run.content.timeSec").minus(this.get("splitTime").times(this.get("splitCountCeiled").minus(1)));
  }),

  /**
   * Average pace of the first half
   *
   * @return {BigNumber} average pace in min/km
   */
  averagePaceFirstHalf: Ember.computed("run.content.paceMinPerKmRaw", "run.content.paceMinPerKmRaw", "splittingStrategy", function(){
    return this.get("run.content.paceMinPerKmRaw").plus(this.get("run.content.paceMinPerKmRaw").times(this.get("splittingStrategy")).dividedBy(100));
  }),

  /**
   * Average pace of the second half
   *
   * @return {BigNumber} average pace in min/km
   */
  averagePaceSecondHalf: Ember.computed("run.content.paceMinPerKmRaw", "run.content.paceMinPerKmRaw", "splittingStrategySecondHalf", function(){
    return this.get("run.content.paceMinPerKmRaw").plus(this.get("run.content.paceMinPerKmRaw").times(this.get("splittingStrategySecondHalf")).dividedBy(100));
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
  slope: Ember.computed("averagePaceFirstHalf", "averagePaceSecondHalf", "run.content.lengthKmRaw", function(){
    // like in https://en.wikipedia.org/wiki/Slope
    var a = this.get("averagePaceFirstHalf").minus(this.get("averagePaceSecondHalf"));
    var b = this.get("run.content.lengthKmRaw").dividedBy(4).minus(this.get("run.content.lengthKmRaw").dividedBy(4).times(3));
    return a.dividedBy(b);
  }),

  /**
   * Shift of the pace when evenSlope is requested
   *
   * @return {BigNumber}
   */
  shift: Ember.computed("averagePaceFirstHalf", "slope", "run.content.lengthKmRaw", function(){
    // calculared by using https://en.wikipedia.org/wiki/Equation
    return this.get("averagePaceFirstHalf").minus(this.get("slope").times(this.get("run.content.lengthKmRaw").dividedBy(4)));
  }),

  /**
   * array of run objects describing the splits of a race
   *
   * @return {array}
   */
  splits: [],

  /**
   * calcluates the splits and sets the splits array
   *
   * @return {undefined}
   */
  calculateSplits: function(){
    this.get("splits").clear();

    var lengthMStack = new BigNumber(0); // how long is the entire run until the current split
    var timeSecStack = new BigNumber(0); // how much time of the entire run until the current split

    if(this.get("splitCountCeiled").greaterThan(1) === true){
      for (let i = 1; this.get("splitCountCeiled").greaterThanOrEqualTo(i); i++) {
        var thisSplitDistance = this.get("splitCountCeiled").equals(i) ? this.get("lastSplitDistance") : this.get("splitDistance"); // different length for last split

        var beforeTurningPoint = this.get("turningPointSplit").greaterThanOrEqualTo(i); // are we in a split that is before the turning point
        var currentSplittingStrategy = beforeTurningPoint ? this.get("splittingStrategy") : this.get("splittingStrategySecondHalf"); // splitting strategy of the current split
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
        var progressDistance = lengthMStack.dividedBy(this.get("run.content.lengthM")).times(100);
        var progressTime = timeSecStack.dividedBy(this.get("run.content.timeSec")).times(100);

        var test = thisSplitTime.dividedBy(this.get("splitTime")).times(100);
        var test2 = thisSplitDistance.dividedBy(this.get("splitDistance")).times(100);
        var test3 = test.dividedBy(test2).times(100);
        this.get("splits").push(Ember.Object.create({
          'split' : this.store.createRecord('run', {
            timeSec : thisSplitTime,
            lengthM : thisSplitDistance
          }),
          'run' : this.store.createRecord('run', {
            timeSec : timeSecStack,
            lengthM : lengthMStack
          }),
          'progressDistance' : progressDistance.round(2).toString(),
          'progressTime' : progressTime.round(2).toString(),
          // 'progressSpeed' : thisSplitTime.dividedBy(thisSplitDistance).times(100).dividedBy(splitTime).times(100)
          'progressSpeed' : test3.toString()
        }));
      }
      return true;
    }else{
      return false;
    }
  }
});
