'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TagSpan = exports.Footer = exports.Detail = exports.CardRightContent = exports.CardTitle = exports.CardHeader = exports.Placeholder = exports.CardWrapper = exports.DraggableList = exports.RightContent = exports.Title = exports.Header = exports.Section = exports.BoardDiv = undefined;

var _templateObject = _taggedTemplateLiteral(['\n  background-color: #23719F;\n  overflow-y: hidden;\n  padding: 5px;\n  font: 14px/18px "Helvetica Neue", Arial, Helvetica, sans-serif;\n  color: #393939;\n  display: flex;\n  flex-direction: row;\n  align-items: flex-start;\n  height: 100vh;\n'], ['\n  background-color: #23719F;\n  overflow-y: hidden;\n  padding: 5px;\n  font: 14px/18px "Helvetica Neue", Arial, Helvetica, sans-serif;\n  color: #393939;\n  display: flex;\n  flex-direction: row;\n  align-items: flex-start;\n  height: 100vh;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  background-color: #E3E3E3;\n  border-radius: 3px;\n  margin: 5px 5px;\n  padding: 10px;\n  min-width: 250px;\n  height: auto;\n  max-height: 95%;\n  overflow-y: auto;\n'], ['\n  background-color: #E3E3E3;\n  border-radius: 3px;\n  margin: 5px 5px;\n  padding: 10px;\n  min-width: 250px;\n  height: auto;\n  max-height: 95%;\n  overflow-y: auto;\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  margin-bottom: 10px;\n  display: flex;\n  flex-direction: row;\n  align-items: flex-start;\n'], ['\n  margin-bottom: 10px;\n  display: flex;\n  flex-direction: row;\n  align-items: flex-start;\n']),
    _templateObject4 = _taggedTemplateLiteral(['\n  font-weight: bold;\n  font-size: 15px;\n  line-height: 18px;\n  cursor: grab;\n  width: 80%;\n'], ['\n  font-weight: bold;\n  font-size: 15px;\n  line-height: 18px;\n  cursor: grab;\n  width: 80%;\n']),
    _templateObject5 = _taggedTemplateLiteral(['\n  width: 30%;\n  text-align: right;\n  font-size: 13px;\n'], ['\n  width: 30%;\n  text-align: right;\n  font-size: 13px;\n']),
    _templateObject6 = _taggedTemplateLiteral(['\n  min-height: 100px;\n'], ['\n  min-height: 100px;\n']),
    _templateObject7 = _taggedTemplateLiteral(['\n  border-radius: 3px;\n  margin: 10px 0px;\n  border-bottom: 1px solid #CCC;\n  padding: 6px 8px;\n  cursor: pointer;\n  transition: all .3s cubic-bezier(0.23, 1, 0.32, 1);;\n  background-color: #FFF;\n  max-width: 250px;\n\n  &:hover {\n    background-color: #F0F0F0;\n  }\n\n  &.is-moving {\n    background-color: rgba(black, 0.8);\n  }\n'], ['\n  border-radius: 3px;\n  margin: 10px 0px;\n  border-bottom: 1px solid #CCC;\n  padding: 6px 8px;\n  cursor: pointer;\n  transition: all .3s cubic-bezier(0.23, 1, 0.32, 1);;\n  background-color: #FFF;\n  max-width: 250px;\n\n  &:hover {\n    background-color: #F0F0F0;\n  }\n\n  &.is-moving {\n    background-color: rgba(black, 0.8);\n  }\n']),
    _templateObject8 = _taggedTemplateLiteral(['\n  background-color: #CCC;\n  margin: 5px 0px;\n  padding: 10px;\n  min-width: 226px;\n  height: 45px;\n  max-height: 95%;\n  overflow-y: auto;\n'], ['\n  background-color: #CCC;\n  margin: 5px 0px;\n  padding: 10px;\n  min-width: 226px;\n  height: 45px;\n  max-height: 95%;\n  overflow-y: auto;\n']),
    _templateObject9 = _taggedTemplateLiteral(['\n  border-bottom: 1px solid #eee;\n  padding-bottom: 6px;\n'], ['\n  border-bottom: 1px solid #eee;\n  padding-bottom: 6px;\n']),
    _templateObject10 = _taggedTemplateLiteral(['\n font-size: 14px;\n'], ['\n font-size: 14px;\n']),
    _templateObject11 = _taggedTemplateLiteral(['\n  font-size: 10px;\n'], ['\n  font-size: 10px;\n']),
    _templateObject12 = _taggedTemplateLiteral(['\n  font-size: 12px;\n  color: #4d4d4d;\n'], ['\n  font-size: 12px;\n  color: #4d4d4d;\n']),
    _templateObject13 = _taggedTemplateLiteral(['\n  border-top: 1px solid #eee;\n  padding-top: 6px;\n  text-align: right;\n   display: flex;\n   justify-content: flex-end;\n   flex-direction: row;\n   flex-wrap: wrap;\n'], ['\n  border-top: 1px solid #eee;\n  padding-top: 6px;\n  text-align: right;\n   display: flex;\n   justify-content: flex-end;\n   flex-direction: row;\n   flex-wrap: wrap;\n']),
    _templateObject14 = _taggedTemplateLiteral(['\n  padding: 2px 3px;\n  font-size: 80%;\n  border-radius: 3px;\n  margin: 2px 5px;\n  font-size: 70%;\n'], ['\n  padding: 2px 3px;\n  font-size: 80%;\n  border-radius: 3px;\n  margin: 2px 5px;\n  font-size: 70%;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var BoardDiv = exports.BoardDiv = _styledComponents2.default.div(_templateObject);

var Section = exports.Section = _styledComponents2.default.section(_templateObject2);

var Header = exports.Header = _styledComponents2.default.header(_templateObject3);

var Title = exports.Title = _styledComponents2.default.span(_templateObject4);

var RightContent = exports.RightContent = _styledComponents2.default.span(_templateObject5);

var DraggableList = exports.DraggableList = _styledComponents2.default.div(_templateObject6);

var CardWrapper = exports.CardWrapper = _styledComponents2.default.article(_templateObject7);

var Placeholder = exports.Placeholder = _styledComponents2.default.section(_templateObject8);

var CardHeader = exports.CardHeader = (0, _styledComponents2.default)(Header)(_templateObject9);

var CardTitle = exports.CardTitle = (0, _styledComponents2.default)(Title)(_templateObject10);

var CardRightContent = exports.CardRightContent = (0, _styledComponents2.default)(RightContent)(_templateObject11);

var Detail = exports.Detail = _styledComponents2.default.div(_templateObject12);

var Footer = exports.Footer = _styledComponents2.default.div(_templateObject13);

var TagSpan = exports.TagSpan = _styledComponents2.default.span(_templateObject14);