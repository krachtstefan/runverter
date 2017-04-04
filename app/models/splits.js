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

  // what is the spliting strategy? negative, positive or even?
  splittingStrategy : new BigNumber(50),

  // reverse splitting strategy on second half
  splittingStrategySecondHalf: Ember.computed("splittingStrategy", function(){
    return this.get("splittingStrategy").times(-1);
  }),

  // how many splits do we need?
  splitCount: Ember.computed("run.content.lengthM", "splitDistance", function(){
    return this.get("run.content.lengthM").dividedBy(this.get("splitDistance"));
  }),

  // how many splits do we need? (ceiled)
  splitCountCeiled: Ember.computed("splitCount", function(){
    return this.get("splitCount").ceil();
  }),

  // if not even divisible, how long is the last split?
  lastSplitDistance: Ember.computed("run.content.lengthM", "splitDistance", "splitCountCeiled", function(){
    return this.get("run.content.lengthM").minus(this.get("splitDistance").times(this.get("splitCountCeiled").minus(1)));
  }),

  // split number of the turning point
  turningPointSplit: Ember.computed("splitCountCeiled", function(){
    return this.get("splitCountCeiled").dividedBy(2).ceil();
  }),

  // position of the turning point
  turningPointM: Ember.computed("run.content.lengthM", function(){
    return this.get("run.content.lengthM").dividedBy(2);
  }),

  // is the turning point within a split or exactly at the border between two splits
  turningPointWithinSplit: Ember.computed("splitCount", function(){
    return this.get("splitCount")%2 === 0 ? false : true;
  }),

  // how much time for a splitDistance (assume an even pacing)
  splitTime: Ember.computed("run.content.timeSec", "splitCount", function(){
    return this.get("run.content.timeSec").dividedBy(this.get("splitCount"));
  }),

  // how much time for the last splitDistance (assume an even pacing)
  lastSplitTime: Ember.computed("run.content.timeSec", "splitTime", "splitCountCeiled", function(){
    return this.get("run.content.timeSec").minus(this.get("splitTime").times(this.get("splitCountCeiled").minus(1)));
  }),

  averagePaceFirstHalf: Ember.computed("run.content.paceMinPerKmRaw", "run.content.paceMinPerKmRaw", "splittingStrategy", function(){
    return this.get("run.content.paceMinPerKmRaw").plus(this.get("run.content.paceMinPerKmRaw").times(this.get("splittingStrategy")).dividedBy(100));
  }),

  averagePaceSecondHalf: Ember.computed("run.content.paceMinPerKmRaw", "run.content.paceMinPerKmRaw", "splittingStrategySecondHalf", function(){
    return this.get("run.content.paceMinPerKmRaw").plus(this.get("run.content.paceMinPerKmRaw").times(this.get("splittingStrategySecondHalf")).dividedBy(100));
  }),

  evenSlope : false,

  /**
   * array of run objects describing the splits of a race
   *
   * @return {array}
   */
  splits: [],

  /**
   *
   * @param  {BigNumber|string|number} splitDistance distance that each splits will have (last split may differ)
   *
   * @return {boolean}
   */
  calculateSplits: function(){
    this.get("splits").clear();
    var a = this.get("averagePaceFirstHalf").minus(this.get("averagePaceSecondHalf"));
    var b = this.get("run.content.lengthKmRaw").dividedBy(4).minus(this.get("run.content.lengthKmRaw").dividedBy(4).times(3));
    var slope = a.dividedBy(b);
    var shift = this.get("averagePaceFirstHalf").minus(slope.times(this.get("run.content.lengthKmRaw").dividedBy(4)));

    var lengthMStack = new BigNumber(0); // how long is the entire run until the current split
    var timeSecStack = new BigNumber(0); // how much time of the entire run until the current split

    if(this.get("splitCountCeiled").greaterThan(1) === true){
      for (let i = 1; this.get("splitCountCeiled").greaterThanOrEqualTo(i); i++) {
        var thisSplitDistance = this.get("splitCountCeiled").equals(i) ? this.get("lastSplitDistance") : this.get("splitDistance"); // different length for last split

        var beforeTurningPoint = this.get("turningPointSplit").greaterThanOrEqualTo(i); // are we in a split that is before the turning point
        var currentSplittingStrategy = beforeTurningPoint ? this.get("splittingStrategy") : this.get("splittingStrategySecondHalf"); // splitting strategy of the current split
        var thisSplitTime = this.get("splitCountCeiled").equals(i) ? this.get("lastSplitTime") : this.get("splitTime"); // different time for last split

        if(this.get("evenSlope") === true){
          // get the average pace from the middle of the current split
          var averagePaceCurrent = lengthMStack.plus(thisSplitDistance.dividedBy(2)).dividedBy(1000).times(slope).plus(shift);
        }else{
          var averagePaceCurrent = beforeTurningPoint ? this.get("averagePaceFirstHalf") : this.get("averagePaceSecondHalf");
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
  },


  /**
   * update updatedAt before saving the settings
   */
  save: function(){
    this.set("updatedAt", new Date());
    this._super(...arguments);
  },
});
