"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var LaneHelper = {

  initialiseLanes: function initialiseLanes(state, _ref) {
    var lanes = _ref.lanes;

    var updatedLanes = lanes.map(function (lane) {
      lane.currentPage = 1;
      return lane;
    });
    return { lanes: updatedLanes };
  },

  paginateLane: function paginateLane(state, _ref2) {
    var laneId = _ref2.laneId,
        newCards = _ref2.newCards,
        nextPage = _ref2.nextPage;

    var updatedLanes = LaneHelper.appendCardsToLane(state, { laneId: laneId, newCards: newCards });
    updatedLanes.find(function (lane) {
      return lane.id === laneId;
    }).currentPage = nextPage;
    return _extends({}, state, updatedLanes);
  },

  appendCardsToLane: function appendCardsToLane(state, _ref3) {
    var laneId = _ref3.laneId,
        newCards = _ref3.newCards,
        index = _ref3.index;

    var lanes = state.lanes.map(function (lane) {
      if (lane.id === laneId) {
        if (index !== undefined) {
          var _lane$cards;

          (_lane$cards = lane.cards).splice.apply(_lane$cards, [index, 0].concat(_toConsumableArray(newCards)));
        } else {
          lane.cards = [].concat(_toConsumableArray(lane.cards), _toConsumableArray(newCards));
        }
      }
      return lane;
    });
    return lanes;
  },

  appendCardToLane: function appendCardToLane(state, _ref4) {
    var laneId = _ref4.laneId,
        card = _ref4.card,
        index = _ref4.index;

    var updatedLanes = LaneHelper.appendCardsToLane(state, { laneId: laneId, newCards: [card], index: index });
    return _extends({}, state, updatedLanes);
  },

  removeCardFromLane: function removeCardFromLane(state, _ref5) {
    var laneId = _ref5.laneId,
        cardId = _ref5.cardId;

    var lanes = state.lanes.map(function (lane) {
      if (lane.id === laneId) {
        lane.cards = lane.cards.filter(function (card) {
          return card.id !== cardId;
        });
      }
      return lane;
    });
    return _extends({}, state, lanes);
  },

  moveCardAcrossLanes: function moveCardAcrossLanes(state, _ref6) {
    var fromLaneId = _ref6.fromLaneId,
        toLaneId = _ref6.toLaneId,
        cardId = _ref6.cardId;

    var cardToMove = null;
    var interimLanes = state.lanes.map(function (lane) {
      if (lane.id === fromLaneId) {
        cardToMove = lane.cards.find(function (card) {
          return card.id === cardId;
        });
        lane.cards = lane.cards.filter(function (card) {
          return card.id !== cardId;
        });
      }
      return lane;
    });
    return LaneHelper.appendCardToLane({ lanes: interimLanes }, { laneId: toLaneId, card: cardToMove });
  },

  updateCardsForLane: function updateCardsForLane(state, _ref7) {
    var laneId = _ref7.laneId,
        cards = _ref7.cards;

    var lanes = state.lanes.map(function (lane) {
      if (lane.id === laneId) {
        lane.cards = cards;
      }
      return lane;
    });
    return _extends({}, state, lanes);
  },

  updateLanes: function updateLanes(state, lanes) {
    return _extends({}, state, { lanes: lanes });
  }
};

exports.default = LaneHelper;