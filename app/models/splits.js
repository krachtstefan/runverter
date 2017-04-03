import DS from 'ember-data';
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
  calculateSplits: function(splitDistance = new BigNumber(1000), splittingStrategy = new BigNumber(0), evenSlope = false){
    this.get("splits").clear();

    splitDistance = this._ensureBigNumber(splitDistance); // how long is a split?
    splittingStrategy = this._ensureBigNumber(splittingStrategy).times(-1); // what is the spliting strategy? negative, positive or even?
    var splittingStrategySecondHalf = splittingStrategy.times(-1); // reverse splitting strategy on second half

    let splitCount = this.get("lengthM").dividedBy(splitDistance); // how many splits do we need?
    let splitCountCeiled = splitCount.ceil(); // how many splits do we need? (ceiled)
    let lastSplitDistance = this.get("lengthM").minus(splitDistance.times(splitCountCeiled.minus(1))); // if not even divisible, how long is the last split?
    let turningPointSplit = splitCountCeiled.dividedBy(2).ceil(); // split number of the turning point
    let turningPointM = this.get("lengthM").dividedBy(2); // position of the turning point
    let turningPointWithinSplit = splitCount%2 === 0 ? false : true; // is the turning point within a split or exactly at the border between two splits

    let splitTime = this.get("timeSec").dividedBy(splitCount); // how much time for a splitDistance (assume an even pacing)
    let lastSplitTime = this.get("timeSec").minus(splitTime.times(splitCountCeiled.minus(1))); // how much time for the last splitDistance (assume an even pacing)

    var averagePaceFirstHalf = this.get("paceMinPerKmRaw").plus(this.get("paceMinPerKmRaw").times(splittingStrategy).dividedBy(100));
    var averagePaceSecondHalf = this.get("paceMinPerKmRaw").plus(this.get("paceMinPerKmRaw").times(splittingStrategySecondHalf).dividedBy(100));

    var a = averagePaceFirstHalf.minus(averagePaceSecondHalf);
    var b = this.get("lengthKmRaw").dividedBy(4).minus(this.get("lengthKmRaw").dividedBy(4).times(3));
    var slope = a.dividedBy(b);
    var shift = averagePaceFirstHalf.minus(slope.times(this.get("lengthKmRaw").dividedBy(4)));

    var lengthMStack = new BigNumber(0); // how long is the entire run until the current split
    var timeSecStack = new BigNumber(0); // how much time of the entire run until the current split

    if(splitCountCeiled.greaterThan(1) === true){
      for (let i = 1; splitCountCeiled.greaterThanOrEqualTo(i); i++) {
        var thisSplitDistance = splitCountCeiled.equals(i) ? lastSplitDistance : splitDistance; // different length for last split

        var beforeTurningPoint = turningPointSplit.greaterThanOrEqualTo(i); // are we in a split that is before the turning point
        var currentSplittingStrategy = beforeTurningPoint ? splittingStrategy : splittingStrategySecondHalf; // splitting strategy of the current split
        var thisSplitTime = splitCountCeiled.equals(i) ? lastSplitTime : splitTime; // different time for last split

        if(evenSlope === true){
          // get the average pace from the middle of the current split
          var averagePaceCurrent = lengthMStack.plus(thisSplitDistance.dividedBy(2)).dividedBy(1000).times(slope).plus(shift);
        }else{
          var averagePaceCurrent = beforeTurningPoint ? averagePaceFirstHalf : averagePaceSecondHalf;
        }

        lengthMStack = lengthMStack.plus(thisSplitDistance);
        // apply splitting strategy
        // check if this run has a turning point somewhere in the middle of a split and if this is the current one
        // also check if no evenSlope is requested and the turning point is not needed
        if(turningPointWithinSplit === true && turningPointSplit.equals(i) && evenSlope === false){
          var turningPointSplitDistance = turningPointM.minus(splitDistance.times(i-1));
          // determine the ratio between pre and post turning point distance
          var turningPointSplitRatio1 = turningPointSplitDistance.dividedBy(splitDistance).times(100);
          var turningPointSplitRatio2 = new BigNumber(100).minus(turningPointSplitRatio1);
          // determine the time of both splitting strategies
          var thisSplitTime1 = averagePaceFirstHalf.times(60).times(thisSplitDistance.dividedBy(1000));
          var thisSplitTime2 = averagePaceSecondHalf.times(60).times(thisSplitDistance.dividedBy(1000));
          // sum both times according to their ratio
          var time1 = thisSplitTime1.times(turningPointSplitRatio1).dividedBy(100);
          var time2 = thisSplitTime2.times(turningPointSplitRatio2).dividedBy(100);
          thisSplitTime = time1.plus(time2);
        }else{
          thisSplitTime = averagePaceCurrent.times(60).times(thisSplitDistance.dividedBy(1000));
        }


        timeSecStack = timeSecStack.plus(thisSplitTime);
        var progressDistance = lengthMStack.dividedBy(this.get("lengthM")).times(100);
        var progressTime = timeSecStack.dividedBy(this.get("timeSec")).times(100);

        var test = thisSplitTime.dividedBy(splitTime).times(100);
        var test2 = thisSplitDistance.dividedBy(splitDistance).times(100);
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
