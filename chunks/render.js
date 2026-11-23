var GUI =
(window["webpackJsonpGUI"] = window["webpackJsonpGUI"] || []).push([["render"],{

/***/ "./src/lib/blocks.js":
/*!***************************!*\
  !*** ./src/lib/blocks.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Connect scratch blocks with the vm
 * @param {VirtualMachine} vm - The scratch vm
 * @param {Bool} useCatBlocks - Whether to use cat blocks rendering of ScratchBlocks
 * @return {ScratchBlocks} ScratchBlocks connected with the vm
 */
/* harmony default export */ __webpack_exports__["default"] = (function (vm, useCatBlocks) {
  var ScratchBlocks = useCatBlocks ? __webpack_require__(/*! cat-blocks */ "./node_modules/cat-blocks/shim/vertical.js") : __webpack_require__(/*! scratch-blocks */ "./node_modules/scratch-blocks/shim/vertical.js");
  var jsonForMenuBlock = function jsonForMenuBlock(name, menuOptionsFn, colors, start) {
    return {
      message0: '%1',
      args0: [{
        type: 'field_dropdown',
        name: name,
        options: function options() {
          return start.concat(menuOptionsFn());
        }
      }],
      inputsInline: true,
      output: 'String',
      colour: colors.secondary,
      colourSecondary: colors.secondary,
      colourTertiary: colors.tertiary,
      colourQuaternary: colors.quaternary,
      outputShape: ScratchBlocks.OUTPUT_SHAPE_ROUND
    };
  };
  var jsonForHatBlockMenu = function jsonForHatBlockMenu(hatName, name, menuOptionsFn, colors, start) {
    return {
      message0: hatName,
      args0: [{
        type: 'field_dropdown',
        name: name,
        options: function options() {
          return start.concat(menuOptionsFn());
        }
      }],
      colour: colors.primary,
      colourSecondary: colors.secondary,
      colourTertiary: colors.tertiary,
      colourQuaternary: colors.quaternary,
      extensions: ['shape_hat']
    };
  };
  var jsonForSensingMenus = function jsonForSensingMenus(menuOptionsFn) {
    return {
      message0: ScratchBlocks.Msg.SENSING_OF,
      args0: [{
        type: 'field_dropdown',
        name: 'PROPERTY',
        options: function options() {
          return menuOptionsFn();
        }
      }, {
        type: 'input_value',
        name: 'OBJECT'
      }],
      output: true,
      colour: ScratchBlocks.Colours.sensing.primary,
      colourSecondary: ScratchBlocks.Colours.sensing.secondary,
      colourTertiary: ScratchBlocks.Colours.sensing.tertiary,
      colourQuaternary: ScratchBlocks.Colours.sensing.quaternary,
      outputShape: ScratchBlocks.OUTPUT_SHAPE_ROUND
    };
  };
  var soundsMenu = function soundsMenu() {
    var menu = [['', '']];
    if (vm.editingTarget && vm.editingTarget.sprite.sounds.length > 0) {
      menu = vm.editingTarget.sprite.sounds.map(function (sound) {
        return [sound.name, sound.name];
      });
    }
    menu.push([ScratchBlocks.ScratchMsgs.translate('SOUND_RECORD', 'record...'), ScratchBlocks.recordSoundCallback]);
    return menu;
  };
  var costumesMenu = function costumesMenu() {
    if (vm.editingTarget && vm.editingTarget.getCostumes().length > 0) {
      return vm.editingTarget.getCostumes().map(function (costume) {
        return [costume.name, costume.name];
      });
    }
    return [['', '']];
  };
  var backdropsMenu = function backdropsMenu() {
    var next = ScratchBlocks.ScratchMsgs.translate('LOOKS_NEXTBACKDROP', 'next backdrop');
    var previous = ScratchBlocks.ScratchMsgs.translate('LOOKS_PREVIOUSBACKDROP', 'previous backdrop');
    var random = ScratchBlocks.ScratchMsgs.translate('LOOKS_RANDOMBACKDROP', 'random backdrop');
    if (vm.runtime.targets[0] && vm.runtime.targets[0].getCostumes().length > 0) {
      return vm.runtime.targets[0].getCostumes().map(function (costume) {
        return [costume.name, costume.name];
      }).concat([[next, 'next backdrop'], [previous, 'previous backdrop'], [random, 'random backdrop']]);
    }
    return [['', '']];
  };
  var backdropNamesMenu = function backdropNamesMenu() {
    var stage = vm.runtime.getTargetForStage();
    if (stage && stage.getCostumes().length > 0) {
      return stage.getCostumes().map(function (costume) {
        return [costume.name, costume.name];
      });
    }
    return [['', '']];
  };
  var spriteMenu = function spriteMenu() {
    var sprites = [];
    for (var targetId in vm.runtime.targets) {
      if (!vm.runtime.targets.hasOwnProperty(targetId)) continue;
      if (vm.runtime.targets[targetId].isOriginal) {
        if (!vm.runtime.targets[targetId].isStage) {
          if (vm.runtime.targets[targetId] === vm.editingTarget) {
            continue;
          }
          sprites.push([vm.runtime.targets[targetId].sprite.name, vm.runtime.targets[targetId].sprite.name]);
        }
      }
    }
    return sprites;
  };
  var cloneMenu = function cloneMenu() {
    if (vm.editingTarget && vm.editingTarget.isStage) {
      var menu = spriteMenu();
      if (menu.length === 0) {
        return [['', '']]; // Empty menu matches Scratch 2 behavior
      }
      return menu;
    }
    var myself = ScratchBlocks.ScratchMsgs.translate('CONTROL_CREATECLONEOF_MYSELF', 'myself');
    return [[myself, '_myself_']].concat(spriteMenu());
  };
  var soundColors = ScratchBlocks.Colours.sounds;
  var looksColors = ScratchBlocks.Colours.looks;
  var motionColors = ScratchBlocks.Colours.motion;
  var sensingColors = ScratchBlocks.Colours.sensing;
  var controlColors = ScratchBlocks.Colours.control;
  var eventColors = ScratchBlocks.Colours.event;
  ScratchBlocks.Blocks.sound_sounds_menu.init = function () {
    var json = jsonForMenuBlock('SOUND_MENU', soundsMenu, soundColors, []);
    this.jsonInit(json);
  };
  ScratchBlocks.Blocks.looks_costume.init = function () {
    var json = jsonForMenuBlock('COSTUME', costumesMenu, looksColors, []);
    this.jsonInit(json);
  };
  ScratchBlocks.Blocks.looks_backdrops.init = function () {
    var json = jsonForMenuBlock('BACKDROP', backdropsMenu, looksColors, []);
    this.jsonInit(json);
  };
  ScratchBlocks.Blocks.event_whenbackdropswitchesto.init = function () {
    var json = jsonForHatBlockMenu(ScratchBlocks.Msg.EVENT_WHENBACKDROPSWITCHESTO, 'BACKDROP', backdropNamesMenu, eventColors, []);
    this.jsonInit(json);
  };
  ScratchBlocks.Blocks.motion_pointtowards_menu.init = function () {
    var mouse = ScratchBlocks.ScratchMsgs.translate('MOTION_POINTTOWARDS_POINTER', 'mouse-pointer');
    var json = jsonForMenuBlock('TOWARDS', spriteMenu, motionColors, [[mouse, '_mouse_']]);
    this.jsonInit(json);
  };
  ScratchBlocks.Blocks.motion_goto_menu.init = function () {
    var random = ScratchBlocks.ScratchMsgs.translate('MOTION_GOTO_RANDOM', 'random position');
    var mouse = ScratchBlocks.ScratchMsgs.translate('MOTION_GOTO_POINTER', 'mouse-pointer');
    var json = jsonForMenuBlock('TO', spriteMenu, motionColors, [[random, '_random_'], [mouse, '_mouse_']]);
    this.jsonInit(json);
  };
  ScratchBlocks.Blocks.motion_glideto_menu.init = function () {
    var random = ScratchBlocks.ScratchMsgs.translate('MOTION_GLIDETO_RANDOM', 'random position');
    var mouse = ScratchBlocks.ScratchMsgs.translate('MOTION_GLIDETO_POINTER', 'mouse-pointer');
    var json = jsonForMenuBlock('TO', spriteMenu, motionColors, [[random, '_random_'], [mouse, '_mouse_']]);
    this.jsonInit(json);
  };
  ScratchBlocks.Blocks.sensing_of_object_menu.init = function () {
    var stage = ScratchBlocks.ScratchMsgs.translate('SENSING_OF_STAGE', 'Stage');
    var json = jsonForMenuBlock('OBJECT', spriteMenu, sensingColors, [[stage, '_stage_']]);
    this.jsonInit(json);
  };
  ScratchBlocks.Blocks.sensing_of.init = function () {
    var blockId = this.id;
    var blockType = this.type;

    // Get the sensing_of block from vm.
    var defaultSensingOfBlock;
    var blocks = vm.runtime.flyoutBlocks._blocks;
    Object.keys(blocks).forEach(function (id) {
      var block = blocks[id];
      if (id === blockType || block && block.opcode === blockType) {
        defaultSensingOfBlock = block;
      }
    });

    // Function that fills in menu for the first input in the sensing block.
    // Called every time it opens since it depends on the values in the other block input.
    var menuFn = function menuFn() {
      var stageOptions = [[ScratchBlocks.Msg.SENSING_OF_BACKDROPNUMBER, 'backdrop #'], [ScratchBlocks.Msg.SENSING_OF_BACKDROPNAME, 'backdrop name'], [ScratchBlocks.Msg.SENSING_OF_VOLUME, 'volume']];
      var spriteOptions = [[ScratchBlocks.Msg.SENSING_OF_XPOSITION, 'x position'], [ScratchBlocks.Msg.SENSING_OF_YPOSITION, 'y position'], [ScratchBlocks.Msg.SENSING_OF_DIRECTION, 'direction'], [ScratchBlocks.Msg.SENSING_OF_COSTUMENUMBER, 'costume #'], [ScratchBlocks.Msg.SENSING_OF_COSTUMENAME, 'costume name'], [ScratchBlocks.Msg.SENSING_OF_SIZE, 'size'], [ScratchBlocks.Msg.SENSING_OF_VOLUME, 'volume']];
      if (vm.editingTarget) {
        var lookupBlocks = vm.editingTarget.blocks;
        var sensingOfBlock = lookupBlocks.getBlock(blockId);

        // The block doesn't exist, but should be in the flyout. Look there.
        if (!sensingOfBlock) {
          sensingOfBlock = vm.runtime.flyoutBlocks.getBlock(blockId) || defaultSensingOfBlock;
          // If we still don't have a block, just return an empty list . This happens during
          // scratch blocks construction.
          if (!sensingOfBlock) {
            return [['', '']];
          }
          // The block was in the flyout so look up future block info there.
          lookupBlocks = vm.runtime.flyoutBlocks;
        }
        var sort = function sort(options) {
          options.sort(ScratchBlocks.scratchBlocksUtils.compareStrings);
        };
        // Get all the stage variables (no lists) so we can add them to menu when the stage is selected.
        var stageVariableOptions = vm.runtime.getTargetForStage().getAllVariableNamesInScopeByType('');
        sort(stageVariableOptions);
        var stageVariableMenuItems = stageVariableOptions.map(function (variable) {
          return [variable, variable];
        });
        if (sensingOfBlock.inputs.OBJECT.shadow !== sensingOfBlock.inputs.OBJECT.block) {
          // There's a block dropped on top of the menu. It'd be nice to evaluate it and
          // return the correct list, but that is tricky. Scratch2 just returns stage options
          // so just do that here too.
          return stageOptions.concat(stageVariableMenuItems);
        }
        var menuBlock = lookupBlocks.getBlock(sensingOfBlock.inputs.OBJECT.shadow);
        var selectedItem = menuBlock.fields.OBJECT.value;
        if (selectedItem === '_stage_') {
          return stageOptions.concat(stageVariableMenuItems);
        }
        // Get all the local variables (no lists) and add them to the menu.
        var target = vm.runtime.getSpriteTargetByName(selectedItem);
        var spriteVariableOptions = [];
        // The target should exist, but there are ways for it not to (e.g. #4203).
        if (target) {
          spriteVariableOptions = target.getAllVariableNamesInScopeByType('', true);
          sort(spriteVariableOptions);
        }
        var spriteVariableMenuItems = spriteVariableOptions.map(function (variable) {
          return [variable, variable];
        });
        return spriteOptions.concat(spriteVariableMenuItems);
      }
      return [['', '']];
    };
    var json = jsonForSensingMenus(menuFn);
    this.jsonInit(json);
  };
  ScratchBlocks.Blocks.sensing_distancetomenu.init = function () {
    var mouse = ScratchBlocks.ScratchMsgs.translate('SENSING_DISTANCETO_POINTER', 'mouse-pointer');
    var json = jsonForMenuBlock('DISTANCETOMENU', spriteMenu, sensingColors, [[mouse, '_mouse_']]);
    this.jsonInit(json);
  };
  ScratchBlocks.Blocks.sensing_touchingobjectmenu.init = function () {
    var mouse = ScratchBlocks.ScratchMsgs.translate('SENSING_TOUCHINGOBJECT_POINTER', 'mouse-pointer');
    var edge = ScratchBlocks.ScratchMsgs.translate('SENSING_TOUCHINGOBJECT_EDGE', 'edge');
    var json = jsonForMenuBlock('TOUCHINGOBJECTMENU', spriteMenu, sensingColors, [[mouse, '_mouse_'], [edge, '_edge_']]);
    this.jsonInit(json);
  };
  ScratchBlocks.Blocks.control_create_clone_of_menu.init = function () {
    var json = jsonForMenuBlock('CLONE_OPTION', cloneMenu, controlColors, []);
    this.jsonInit(json);
  };
  ScratchBlocks.VerticalFlyout.getCheckboxState = function (blockId) {
    var monitoredBlock = vm.runtime.monitorBlocks._blocks[blockId];
    return monitoredBlock ? monitoredBlock.isMonitored : false;
  };
  ScratchBlocks.FlyoutExtensionCategoryHeader.getExtensionState = function (extensionId) {
    if (vm.getPeripheralIsConnected(extensionId)) {
      return ScratchBlocks.StatusButtonState.READY;
    }
    return ScratchBlocks.StatusButtonState.NOT_READY;
  };
  ScratchBlocks.FieldNote.playNote_ = function (noteNum, extensionId) {
    vm.runtime.emit('PLAY_NOTE', noteNum, extensionId);
  };

  // Use a collator's compare instead of localeCompare which internally
  // creates a collator. Using this is a lot faster in browsers that create a
  // collator for every localeCompare call.
  var collator = new Intl.Collator([], {
    sensitivity: 'base',
    numeric: true
  });
  ScratchBlocks.scratchBlocksUtils.compareStrings = function (str1, str2) {
    return collator.compare(str1, str2);
  };

  // Blocks wants to know if 3D CSS transforms are supported. The cross
  // section of browsers Scratch supports and browsers that support 3D CSS
  // transforms will make the return always true.
  //
  // Shortcutting to true lets us skip an expensive style recalculation when
  // first loading the Scratch editor.
  ScratchBlocks.utils.is3dSupported = function () {
    return true;
  };
  return ScratchBlocks;
});

/***/ }),

/***/ "./src/lib/define-dynamic-block.js":
/*!*****************************************!*\
  !*** ./src/lib/define-dynamic-block.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var scratch_vm_src_extension_support_argument_type__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! scratch-vm/src/extension-support/argument-type */ "./node_modules/scratch-vm/src/extension-support/argument-type.js");
/* harmony import */ var scratch_vm_src_extension_support_argument_type__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(scratch_vm_src_extension_support_argument_type__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var scratch_vm_src_extension_support_block_type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! scratch-vm/src/extension-support/block-type */ "./node_modules/scratch-vm/src/extension-support/block-type.js");
/* harmony import */ var scratch_vm_src_extension_support_block_type__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(scratch_vm_src_extension_support_block_type__WEBPACK_IMPORTED_MODULE_1__);
// TODO: access `BlockType` and `ArgumentType` without reaching into VM
// Should we move these into a new extension support module or something?



/**
 * Define a block using extension info which has the ability to dynamically determine (and update) its layout.
 * This functionality is used for extension blocks which can change its properties based on different state
 * information. For example, the `control_stop` block changes its shape based on which menu item is selected
 * and a variable block changes its text to reflect the variable name without using an editable field.
 * @param {object} ScratchBlocks - The ScratchBlocks name space.
 * @param {object} categoryInfo - Information about this block's extension category, including any menus and icons.
 * @param {object} staticBlockInfo - The base block information before any dynamic changes.
 * @param {string} extendedOpcode - The opcode for the block (including the extension ID).
 */
// TODO: grow this until it can fully replace `_convertForScratchBlocks` in the VM runtime
var defineDynamicBlock = function defineDynamicBlock(ScratchBlocks, categoryInfo, staticBlockInfo, extendedOpcode) {
  return {
    init: function init() {
      var blockJson = {
        type: extendedOpcode,
        inputsInline: true,
        category: categoryInfo.name,
        colour: categoryInfo.color1,
        colourSecondary: categoryInfo.color2,
        colourTertiary: categoryInfo.color3
      };
      // There is a scratch-blocks / Blockly extension called "scratch_extension" which adjusts the styling of
      // blocks to allow for an icon, a feature of Scratch extension blocks. However, Scratch "core" extension
      // blocks don't have icons and so they should not use 'scratch_extension'. Adding a scratch-blocks / Blockly
      // extension after `jsonInit` isn't fully supported (?), so we decide now whether there will be an icon.
      if (staticBlockInfo.blockIconURI || categoryInfo.blockIconURI) {
        blockJson.extensions = ['scratch_extension'];
      }
      // initialize the basics of the block, to be overridden & extended later by `domToMutation`
      this.jsonInit(blockJson);
      // initialize the cached block info used to carry block info from `domToMutation` to `mutationToDom`
      this.blockInfoText = '{}';
      // we need a block info update (through `domToMutation`) before we have a completely initialized block
      this.needsBlockInfoUpdate = true;
    },
    mutationToDom: function mutationToDom() {
      var container = document.createElement('mutation');
      container.setAttribute('blockInfo', this.blockInfoText);
      return container;
    },
    domToMutation: function domToMutation(xmlElement) {
      var blockInfoText = xmlElement.getAttribute('blockInfo');
      if (!blockInfoText) return;
      if (!this.needsBlockInfoUpdate) {
        throw new Error('Attempted to update block info twice');
      }
      delete this.needsBlockInfoUpdate;
      this.blockInfoText = blockInfoText;
      var blockInfo = JSON.parse(blockInfoText);
      switch (blockInfo.blockType) {
        case scratch_vm_src_extension_support_block_type__WEBPACK_IMPORTED_MODULE_1___default.a.COMMAND:
        case scratch_vm_src_extension_support_block_type__WEBPACK_IMPORTED_MODULE_1___default.a.CONDITIONAL:
        case scratch_vm_src_extension_support_block_type__WEBPACK_IMPORTED_MODULE_1___default.a.LOOP:
          this.setOutputShape(ScratchBlocks.OUTPUT_SHAPE_SQUARE);
          this.setPreviousStatement(true);
          this.setNextStatement(!blockInfo.isTerminal);
          break;
        case scratch_vm_src_extension_support_block_type__WEBPACK_IMPORTED_MODULE_1___default.a.REPORTER:
          this.setOutput(true);
          this.setOutputShape(ScratchBlocks.OUTPUT_SHAPE_ROUND);
          if (!blockInfo.disableMonitor) {
            this.setCheckboxInFlyout(true);
          }
          break;
        case scratch_vm_src_extension_support_block_type__WEBPACK_IMPORTED_MODULE_1___default.a.BOOLEAN:
          this.setOutput(true);
          this.setOutputShape(ScratchBlocks.OUTPUT_SHAPE_HEXAGONAL);
          break;
        case scratch_vm_src_extension_support_block_type__WEBPACK_IMPORTED_MODULE_1___default.a.HAT:
        case scratch_vm_src_extension_support_block_type__WEBPACK_IMPORTED_MODULE_1___default.a.EVENT:
          this.setOutputShape(ScratchBlocks.OUTPUT_SHAPE_SQUARE);
          this.setNextStatement(true);
          break;
      }
      if (blockInfo.color1 || blockInfo.color2 || blockInfo.color3) {
        // `setColour` handles undefined parameters by adjusting defined colors
        this.setColour(blockInfo.color1, blockInfo.color2, blockInfo.color3);
      }

      // Layout block arguments
      // TODO handle E/C Blocks
      var blockText = blockInfo.text;
      var args = [];
      var argCount = 0;
      var scratchBlocksStyleText = blockText.replace(/\[(.+?)]/g, function (match, argName) {
        var arg = blockInfo.arguments[argName];
        switch (arg.type) {
          case scratch_vm_src_extension_support_argument_type__WEBPACK_IMPORTED_MODULE_0___default.a.STRING:
            args.push({
              type: 'input_value',
              name: argName
            });
            break;
          case scratch_vm_src_extension_support_argument_type__WEBPACK_IMPORTED_MODULE_0___default.a.BOOLEAN:
            args.push({
              type: 'input_value',
              name: argName,
              check: 'Boolean'
            });
            break;
        }
        return "%".concat(++argCount);
      });
      this.interpolate_(scratchBlocksStyleText, args);
    }
  };
};
/* harmony default export */ __webpack_exports__["default"] = (defineDynamicBlock);

/***/ }),

/***/ "./src/lib/themes/dark/index.js":
/*!**************************************!*\
  !*** ./src/lib/themes/dark/index.js ***!
  \**************************************/
/*! exports provided: blockColors, extensions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "blockColors", function() { return blockColors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extensions", function() { return extensions; });
var blockColors = {
  motion: {
    primary: '#0F1E33',
    secondary: '#4C4C4C',
    tertiary: '#4C97FF',
    quaternary: '#4C97FF'
  },
  looks: {
    primary: '#1E1433',
    secondary: '#4C4C4C',
    tertiary: '#9966FF',
    quaternary: '#9966FF'
  },
  sounds: {
    primary: '#291329',
    secondary: '#4C4C4C',
    tertiary: '#CF63CF',
    quaternary: '#CF63CF'
  },
  control: {
    primary: '#332205',
    secondary: '#4C4C4C',
    tertiary: '#FFAB19',
    quaternary: '#FFAB19'
  },
  event: {
    primary: '#332600',
    secondary: '#4C4C4C',
    tertiary: '#FFBF00',
    quaternary: '#FFBF00'
  },
  sensing: {
    primary: '#12232A',
    secondary: '#4C4C4C',
    tertiary: '#5CB1D6',
    quaternary: '#5CB1D6'
  },
  pen: {
    primary: '#03251C',
    secondary: '#4C4C4C',
    tertiary: '#0fBD8C',
    quaternary: '#0fBD8C'
  },
  operators: {
    primary: '#112611',
    secondary: '#4C4C4C',
    tertiary: '#59C059',
    quaternary: '#59C059'
  },
  data: {
    primary: '#331C05',
    secondary: '#4C4C4C',
    tertiary: '#FF8C1A',
    quaternary: '#FF8C1A'
  },
  data_lists: {
    primary: '#331405',
    secondary: '#4C4C4C',
    tertiary: '#FF661A',
    quaternary: '#FF661A'
  },
  more: {
    primary: '#331419',
    secondary: '#4C4C4C',
    tertiary: '#FF6680',
    quaternary: '#FF6680'
  },
  text: 'rgba(255, 255, 255, .7)',
  textFieldText: '#E5E5E5',
  workspace: '#121212',
  toolboxSelected: '#4C4C4C',
  toolboxText: '#E5E5E5',
  toolbox: '#121212',
  flyout: '#121212',
  textField: '#4C4C4C',
  menuHover: 'rgba(255, 255, 255, 0.3)'
};
var extensions = {};


/***/ }),

/***/ "./src/lib/themes/default/icon.svg":
/*!*****************************************!*\
  !*** ./src/lib/themes/default/icon.svg ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "static/assets/64e66a9dcf4b42a699f49e5973a4a62e.svg");

/***/ }),

/***/ "./src/lib/themes/default/index.js":
/*!*****************************************!*\
  !*** ./src/lib/themes/default/index.js ***!
  \*****************************************/
/*! exports provided: blockColors */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "blockColors", function() { return blockColors; });
var blockColors = {
  motion: {
    primary: '#4C97FF',
    secondary: '#4280D7',
    tertiary: '#3373CC',
    quaternary: '#3373CC'
  },
  looks: {
    primary: '#9966FF',
    secondary: '#855CD6',
    tertiary: '#774DCB',
    quaternary: '#774DCB'
  },
  sounds: {
    primary: '#CF63CF',
    secondary: '#C94FC9',
    tertiary: '#BD42BD',
    quaternary: '#BD42BD'
  },
  control: {
    primary: '#FFAB19',
    secondary: '#EC9C13',
    tertiary: '#CF8B17',
    quaternary: '#CF8B17'
  },
  event: {
    primary: '#FFBF00',
    secondary: '#E6AC00',
    tertiary: '#CC9900',
    quaternary: '#CC9900'
  },
  sensing: {
    primary: '#5CB1D6',
    secondary: '#47A8D1',
    tertiary: '#2E8EB8',
    quaternary: '#2E8EB8'
  },
  pen: {
    primary: '#0fBD8C',
    secondary: '#0DA57A',
    tertiary: '#0B8E69',
    quaternary: '#0B8E69'
  },
  operators: {
    primary: '#59C059',
    secondary: '#46B946',
    tertiary: '#389438',
    quaternary: '#389438'
  },
  data: {
    primary: '#FF8C1A',
    secondary: '#FF8000',
    tertiary: '#DB6E00',
    quaternary: '#DB6E00'
  },
  // This is not a new category, but rather for differentiation
  // between lists and scalar variables.
  data_lists: {
    primary: '#FF661A',
    secondary: '#FF5500',
    tertiary: '#E64D00',
    quaternary: '#E64D00'
  },
  more: {
    primary: '#FF6680',
    secondary: '#FF4D6A',
    tertiary: '#FF3355',
    quaternary: '#FF3355'
  },
  text: '#FFFFFF',
  workspace: '#F9F9F9',
  toolboxHover: '#4C97FF',
  toolboxSelected: '#E9EEF2',
  toolboxText: '#575E75',
  toolbox: '#FFFFFF',
  flyout: '#F9F9F9',
  scrollbar: '#CECDCE',
  scrollbarHover: '#CECDCE',
  textField: '#FFFFFF',
  textFieldText: '#575E75',
  insertionMarker: '#000000',
  insertionMarkerOpacity: 0.2,
  dragShadowOpacity: 0.6,
  stackGlow: '#FFF200',
  stackGlowSize: 4,
  stackGlowOpacity: 1,
  replacementGlow: '#FFFFFF',
  replacementGlowSize: 2,
  replacementGlowOpacity: 1,
  colourPickerStroke: '#FFFFFF',
  // CSS colours: support RGBA
  fieldShadow: 'rgba(255, 255, 255, 0.3)',
  dropDownShadow: 'rgba(0, 0, 0, .3)',
  numPadBackground: '#547AB2',
  numPadBorder: '#435F91',
  numPadActiveBackground: '#435F91',
  numPadText: 'white',
  // Do not use hex here, it cannot be inlined with data-uri SVG
  valueReportBackground: '#FFFFFF',
  valueReportBorder: '#AAAAAA',
  menuHover: 'rgba(0, 0, 0, 0.2)'
};


/***/ }),

/***/ "./src/lib/themes/high-contrast/extensions/musicIcon.svg":
/*!***************************************************************!*\
  !*** ./src/lib/themes/high-contrast/extensions/musicIcon.svg ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI2LjQzMzggMzBDMjkuNTEzIDMwIDMxLjYzNjYgMjguMTU2OSAzMS4xNzkgMjUuODc0QzI4LjI5OTQgMTMuMDQzNiAyNy40MjU2IDkuODUxMzQgMjcuOTQ1NCA5LjYwNTQ3QzI4LjMxMjUgOS40MzE4MyAyOS4zNzQ2IDEwLjcyNzYgMzAuOTE2MiAxMS4xMzU5QzM0LjY0MTYgMTIuMTEyNiA0MC4yNzQyIDYuNDA3NTEgMzQuNTY1NSA3LjI5MTg2QzMyLjMyMjQgNy42MzkgMzAuMTU4NyA2LjIzODM2IDI4LjQ4NzkgNS4xNTY3OUMyNS45MDcyIDMuNDg2MiAyNC41MDI0IDIuNTc2ODQgMjUuNzk3NCAxMC4wNDUxQzI2LjQzNDkgMTMuNzAzNSAyNi45Njk3IDE2LjMyMzEgMjcuMzQ3NSAxOC4xNzM5QzI3Ljk5NTcgMjEuMzQ5NCAyOC4xODE5IDIyLjI2MTYgMjcuNjMyNSAyMi4yNzQxQzI3LjMzMjEgMjIuMTUyIDI3LjAzMjcgMjIuMDU3OCAyNi42OTU3IDIxLjk3MjRDMjYuMDg4IDIxLjgyMjUgMjUuNDUxNiAyMS43MzgyIDI0LjgwNTMgMjEuNzM4MkMyMS43MjcxIDIxLjczODIgMTkuNjAzNiAyMy41ODkyIDIwLjA2MjEgMjUuODc0QzIwLjUxMDcgMjguMTU2OSAyMy4zNjQ2IDMwIDI2LjQzMzggMzBaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNOS40Mzg2MSAzNi4wMDAxQzEyLjUwNjUgMzYuMDAwMSAxNC42MzAyIDM0LjE0OCAxNC4xODE3IDMxLjg2NDJDMTEuMzAzMiAxOS4wMzM2IDEwLjQyOTkgMTUuODQxNiAxMC45NDk2IDE1LjU5NThDMTEuMzE2NiAxNS40MjIyIDEyLjM3ODMgMTYuNzE3NyAxMy45MTkgMTcuMTI2QzE3LjY0MjggMTguMTEzNiAyMy4yNzI5IDEyLjM5ODUgMTcuNTY2NyAxMy4yOTE4QzE1LjMyNDggMTMuNjM4NiAxMy4xNjIzIDEyLjIzODIgMTEuNDkyMiAxMS4xNTY5QzguOTEyMzcgOS40ODYzNiA3LjUwNzk3IDguNTc2OTggOC44MDI1MSAxNi4wNDUxQzkuNDQyOTQgMTkuNzI4NiA5Ljk3OTggMjIuMzU5NCAxMC4zNTggMjQuMjEyNUMxMC45OTEyIDI3LjMxNTQgMTEuMTc5NSAyOC4yMzg0IDEwLjY2NDQgMjguMjczMkM5Ljc4NDMyIDI3LjkyNTggOC44MTIzOSAyNy43MjkzIDcuODEwODIgMjcuNzI5M0M0LjczNCAyNy43MjkzIDIuNjExMzQgMjkuNTgwNCAzLjA1OTc4IDMxLjg2NDJDMy41MTgwOSAzNC4xNDggNi4zNzA2OSAzNi4wMDAxIDkuNDM4NjEgMzYuMDAwMVoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=");

/***/ }),

/***/ "./src/lib/themes/high-contrast/extensions/penIcon.svg":
/*!*************************************************************!*\
  !*** ./src/lib/themes/high-contrast/extensions/penIcon.svg ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "static/assets/b631383707e87a454b479dedaa8ca014.svg");

/***/ }),

/***/ "./src/lib/themes/high-contrast/extensions/text2speechIcon.svg":
/*!*********************************************************************!*\
  !*** ./src/lib/themes/high-contrast/extensions/text2speechIcon.svg ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDIxLjY2OTNWMzQuMjgzNEMxNiAzNS44MTUxIDE0IDM2LjUzNTkgMTIuOCAzNS41NDQ4TDEwLjIgMzMuMzgyNEM5LjIgMzIuNTcxNSA4IDMyLjIxMTEgNi43IDMyLjIxMTFINi4zQzUgMzIuMjExMSA0IDMxLjMxMDEgNCAzMC4xMzg4VjI1LjkwNDFDNCAyNC43MzI4IDUgMjMuODMxOCA2LjMgMjMuODMxOEg2LjdDOCAyMy44MzE4IDkuMiAyMy4zODEzIDEwLjEgMjIuNjYwNEwxMi44IDIwLjQ5OEMxNCAxOS40MTY4IDE2IDIwLjIyNzcgMTYgMjEuNjY5M1oiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0yNCA0QzE5LjU4MTcgNCAxNiA3LjU4MTcyIDE2IDEyQzE2IDE1LjExNDcgMTcuNzc5OSAxNy44MTM2IDIwLjM3ODEgMTkuMTM1MUMyMC4yMDk1IDIwLjkwODcgMTkuNjU2NCAyMS42NjU1IDE5LjMwNDIgMjIuMTQ3M0MxOS4xMjY1IDIyLjM5MDQgMTkgMjIuNTYzNSAxOSAyMi43NjE5QzE5IDIzLjQyODYgMTkuNjY2NyAyMy40Mjg2IDE5LjY2NjcgMjMuNDI4NkMyMC42MTMyIDIzLjQyODYgMjMuNTgxMyAyMi4yNjIzIDI1LjQwOTcgMjBIMjhDMzIuNDE4MyAyMCAzNiAxNi40MTgzIDM2IDEyQzM2IDcuNTgxNzIgMzIuNDE4MyA0IDI4IDRIMjRaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjMEI4RTY5Ii8+Cjwvc3ZnPgo=");

/***/ }),

/***/ "./src/lib/themes/high-contrast/extensions/translateIcon.svg":
/*!*******************************************************************!*\
  !*** ./src/lib/themes/high-contrast/extensions/translateIcon.svg ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "static/assets/ef4a998a82a8567de018baa4607bc6a0.svg");

/***/ }),

/***/ "./src/lib/themes/high-contrast/extensions/videoSensingIcon.svg":
/*!**********************************************************************!*\
  !*** ./src/lib/themes/high-contrast/extensions/videoSensingIcon.svg ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBvcGFjaXR5PSIwLjI1IiBjeD0iMzIiIGN5PSIyNiIgcj0iNCIgZmlsbD0id2hpdGUiIHN0cm9rZT0iIzBCOEU2OSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgb3BhY2l0eT0iMC41IiBjeD0iMzIiIGN5PSIyMiIgcj0iNCIgZmlsbD0id2hpdGUiIHN0cm9rZT0iIzBCOEU2OSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgb3BhY2l0eT0iMC43NSIgY3g9IjMyIiBjeT0iMTgiIHI9IjQiIGZpbGw9IndoaXRlIiBzdHJva2U9IiMwQjhFNjkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSIzMiIgY3k9IjE0IiByPSI0IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjMEI4RTY5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTE3IDE3LjVMMjIuNCAxNEMyMi45IDEzLjcgMjMuNSAxMy44IDIzLjggMTQuM0MyMy45IDE0LjUgMjQgMTQuNyAyNCAxNC44VjI1LjFDMjQgMjUuNyAyMy41IDI2LjEgMjMgMjYuMUMyMi44IDI2LjEgMjIuNiAyNiAyMi41IDI1LjlMMTcgMjIuNlYyNEMxNyAyNi4yIDE1LjIgMjguMSAxMyAyOC4xSDQuMUMxLjggMjggMCAyNi4yIDAgMjRWMTYuMUMwIDEzLjggMS44IDEyIDQuMSAxMkgxM0MxNS4yIDEyIDE3IDEzLjggMTcgMTYuMVYxNy41WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==");

/***/ }),

/***/ "./src/lib/themes/high-contrast/icon.svg":
/*!***********************************************!*\
  !*** ./src/lib/themes/high-contrast/icon.svg ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "static/assets/e4dfc45f34b4606356c4c70ba14a96f0.svg");

/***/ }),

/***/ "./src/lib/themes/high-contrast/index.js":
/*!***********************************************!*\
  !*** ./src/lib/themes/high-contrast/index.js ***!
  \***********************************************/
/*! exports provided: blockColors, extensions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "blockColors", function() { return blockColors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extensions", function() { return extensions; });
/* harmony import */ var _extensions_musicIcon_svg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./extensions/musicIcon.svg */ "./src/lib/themes/high-contrast/extensions/musicIcon.svg");
/* harmony import */ var _extensions_penIcon_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extensions/penIcon.svg */ "./src/lib/themes/high-contrast/extensions/penIcon.svg");
/* harmony import */ var _extensions_text2speechIcon_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./extensions/text2speechIcon.svg */ "./src/lib/themes/high-contrast/extensions/text2speechIcon.svg");
/* harmony import */ var _extensions_translateIcon_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./extensions/translateIcon.svg */ "./src/lib/themes/high-contrast/extensions/translateIcon.svg");
/* harmony import */ var _extensions_videoSensingIcon_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./extensions/videoSensingIcon.svg */ "./src/lib/themes/high-contrast/extensions/videoSensingIcon.svg");





var blockColors = {
  motion: {
    primary: '#80B5FF',
    secondary: '#B3D2FF',
    tertiary: '#3373CC',
    quaternary: '#CCE1FF'
  },
  looks: {
    primary: '#CCB3FF',
    secondary: '#DDCCFF',
    tertiary: '#774DCB',
    quaternary: '#EEE5FF'
  },
  sounds: {
    primary: '#E19DE1',
    secondary: '#FFB3FF',
    tertiary: '#BD42BD',
    quaternary: '#FFCCFF'
  },
  control: {
    primary: '#FFBE4C',
    secondary: '#FFDA99',
    tertiary: '#CF8B17',
    quaternary: '#FFE3B3'
  },
  event: {
    primary: '#FFD966',
    secondary: '#FFECB3',
    tertiary: '#CC9900',
    quaternary: '#FFF2CC'
  },
  sensing: {
    primary: '#85C4E0',
    secondary: '#AED8EA',
    tertiary: '#2E8EB8',
    quaternary: '#C2E2F0'
  },
  pen: {
    primary: '#13ECAF',
    secondary: '#75F0CD',
    tertiary: '#0B8E69',
    quaternary: '#A3F5DE'
  },
  operators: {
    primary: '#7ECE7E',
    secondary: '#B5E3B5',
    tertiary: '#389438',
    quaternary: '#DAF1DA'
  },
  data: {
    primary: '#FFA54C',
    secondary: '#FFCC99',
    tertiary: '#DB6E00',
    quaternary: '#FFE5CC'
  },
  // This is not a new category, but rather for differentiation
  // between lists and scalar variables.
  data_lists: {
    primary: '#FF9966',
    secondary: '#FFCAB0',
    // I don't think this is used, b/c we don't have any droppable fields in list blocks
    tertiary: '#E64D00',
    quaternary: '#FFDDCC'
  },
  more: {
    primary: '#FF99AA',
    secondary: '#FFCCD5',
    tertiary: '#FF3355',
    quaternary: '#FFE5EA'
  },
  text: '#000000',
  textFieldText: '#000000',
  // Text inside of inputs e.g. 90 in [point in direction (90)]
  toolboxText: '#000000',
  // Toolbox text, color picker text (used to be #575E75)
  // The color that the category menu label (e.g. 'motion', 'looks', etc.) changes to on hover
  toolboxHover: '#3373CC',
  insertionMarker: '#000000',
  insertionMarkerOpacity: 0.2,
  fieldShadow: 'rgba(255, 255, 255, 0.3)',
  dragShadowOpacity: 0.6,
  menuHover: 'rgba(255, 255, 255, 0.3)'
};
var extensions = {
  music: {
    blockIconURI: _extensions_musicIcon_svg__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  pen: {
    blockIconURI: _extensions_penIcon_svg__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  text2speech: {
    blockIconURI: _extensions_text2speechIcon_svg__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  translate: {
    blockIconURI: _extensions_translateIcon_svg__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  videoSensing: {
    blockIconURI: _extensions_videoSensingIcon_svg__WEBPACK_IMPORTED_MODULE_4__["default"]
  }
};


/***/ }),

/***/ "./src/lib/themes/index.js":
/*!*********************************!*\
  !*** ./src/lib/themes/index.js ***!
  \*********************************/
/*! exports provided: DEFAULT_THEME, DARK_THEME, HIGH_CONTRAST_THEME, defaultColors, getColorsForTheme, themeMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_THEME", function() { return DEFAULT_THEME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DARK_THEME", function() { return DARK_THEME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HIGH_CONTRAST_THEME", function() { return HIGH_CONTRAST_THEME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getColorsForTheme", function() { return getColorsForTheme; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "themeMap", function() { return themeMap; });
/* harmony import */ var lodash_defaultsdeep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash.defaultsdeep */ "./node_modules/lodash.defaultsdeep/index.js");
/* harmony import */ var lodash_defaultsdeep__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_defaultsdeep__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "./node_modules/react-intl/lib/index.es.js");
/* harmony import */ var _dark__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dark */ "./src/lib/themes/dark/index.js");
/* harmony import */ var _high_contrast__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./high-contrast */ "./src/lib/themes/high-contrast/index.js");
/* harmony import */ var _default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./default */ "./src/lib/themes/default/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "defaultColors", function() { return _default__WEBPACK_IMPORTED_MODULE_4__["blockColors"]; });

/* harmony import */ var _default_icon_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./default/icon.svg */ "./src/lib/themes/default/icon.svg");
/* harmony import */ var _high_contrast_icon_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./high-contrast/icon.svg */ "./src/lib/themes/high-contrast/icon.svg");
var _defineMessages, _themeMap;
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







var DEFAULT_THEME = 'default';
var HIGH_CONTRAST_THEME = 'high-contrast';
var DARK_THEME = 'dark';
var mergeWithDefaults = function mergeWithDefaults(colors) {
  return lodash_defaultsdeep__WEBPACK_IMPORTED_MODULE_0___default()({}, colors, _default__WEBPACK_IMPORTED_MODULE_4__["blockColors"]);
};
var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])((_defineMessages = {}, _defineProperty(_defineMessages, DEFAULT_THEME, {
  "id": "gui.theme.default",
  "defaultMessage": "Original"
}), _defineProperty(_defineMessages, DARK_THEME, {
  "id": "gui.theme.dark",
  "defaultMessage": "Dark"
}), _defineProperty(_defineMessages, HIGH_CONTRAST_THEME, {
  "id": "gui.theme.highContrast",
  "defaultMessage": "High Contrast"
}), _defineMessages));
var themeMap = (_themeMap = {}, _defineProperty(_themeMap, DEFAULT_THEME, {
  blocksMediaFolder: 'blocks-media/default',
  colors: _default__WEBPACK_IMPORTED_MODULE_4__["blockColors"],
  extensions: {},
  label: messages[DEFAULT_THEME],
  icon: _default_icon_svg__WEBPACK_IMPORTED_MODULE_5__["default"]
}), _defineProperty(_themeMap, DARK_THEME, {
  blocksMediaFolder: 'blocks-media/default',
  colors: mergeWithDefaults(_dark__WEBPACK_IMPORTED_MODULE_2__["blockColors"]),
  extensions: _dark__WEBPACK_IMPORTED_MODULE_2__["extensions"],
  label: messages[DARK_THEME]
}), _defineProperty(_themeMap, HIGH_CONTRAST_THEME, {
  blocksMediaFolder: 'blocks-media/high-contrast',
  colors: mergeWithDefaults(_high_contrast__WEBPACK_IMPORTED_MODULE_3__["blockColors"]),
  extensions: _high_contrast__WEBPACK_IMPORTED_MODULE_3__["extensions"],
  label: messages[HIGH_CONTRAST_THEME],
  icon: _high_contrast_icon_svg__WEBPACK_IMPORTED_MODULE_6__["default"]
}), _themeMap);
var getColorsForTheme = function getColorsForTheme(theme) {
  var themeInfo = themeMap[theme];
  if (!themeInfo) {
    throw new Error("Undefined theme ".concat(theme));
  }
  return themeInfo.colors;
};


/***/ }),

/***/ "./src/playground/render.js":
/*!**********************************!*\
  !*** ./src/playground/render.js ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var scratch_vm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! scratch-vm */ "./node_modules/scratch-vm/src/index.js");
/* harmony import */ var scratch_vm__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(scratch_vm__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var scratch_l10n_locales_editor_msgs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! scratch-l10n/locales/editor-msgs */ "./node_modules/scratch-l10n/locales/editor-msgs.js");
/* harmony import */ var _lib_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/blocks */ "./src/lib/blocks.js");
/* harmony import */ var _lib_define_dynamic_block__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/define-dynamic-block */ "./src/lib/define-dynamic-block.js");
/* harmony import */ var _lib_themes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/themes */ "./src/lib/themes/index.js");
/**
 * Render mode: turns a project's scripts into one SVG image, for hosts that
 * only want to show a program (Calliope Campus' teacher view), not edit it.
 *
 * No GUI, no stage, no renderer, no audio, and the VM never runs: it only
 * deserializes the project and loads the extensions its blocks use, so their
 * block definitions are known to scratch-blocks. Each target's scripts are
 * then loaded into one hidden read-only workspace, a target after the other,
 * and copied out as SVG. One SVG holds every target that has blocks, stacked
 * top to bottom, each under its name (when there is more than one).
 *
 * Protocol (postMessage between the host window and this page):
 *   → host: {source: 'calliope-blocks-render', type: 'renderready'}
 *   ← host: {type: 'renderblocks', id, project, locale}
 *   → host: {source: 'calliope-blocks-render', type: 'renderblocks', id,
 *            svg, width, height, error}
 * Requests are answered one at a time, in order. The answer goes to the
 * window that asked, at its origin: the SVG is nothing a page could not make
 * itself from the same project.
 *
 * NOTE: promise chains, not async/await — scratch-gui transpiles to ES5
 * without regenerator-runtime (see containers/blocks.jsx).
 */





var SOURCE = 'calliope-blocks-render';
var MEDIA_PATH = 'static/blocks-media/default/';
/** Space between two targets' scripts, and the height of a target's name. */
var TARGET_GAP = 48;
var LABEL_HEIGHT = 36;
var PADDING = 16;
var SVG_NS = 'http://www.w3.org/2000/svg';
var XLINK_NS = 'http://www.w3.org/1999/xlink';
var vm = new scratch_vm__WEBPACK_IMPORTED_MODULE_0___default.a();
var ScratchBlocks = Object(_lib_blocks__WEBPACK_IMPORTED_MODULE_2__["default"])(vm, false);
var defineBlocks = function defineBlocks(categoryInfo, blockInfoArray) {
  if (!blockInfoArray || blockInfoArray.length === 0) return;
  var staticBlocksJson = [];
  blockInfoArray.forEach(function (blockInfo) {
    if (blockInfo.info && blockInfo.info.isDynamic) {
      var extendedOpcode = "".concat(categoryInfo.id, "_").concat(blockInfo.info.opcode);
      ScratchBlocks.Blocks[extendedOpcode] = Object(_lib_define_dynamic_block__WEBPACK_IMPORTED_MODULE_3__["default"])(ScratchBlocks, categoryInfo, blockInfo, extendedOpcode);
    } else if (blockInfo.json) {
      staticBlocksJson.push(blockInfo.json);
    }
  });
  ScratchBlocks.defineBlocksWithJsonArray(staticBlocksJson);
};

// Same as the editor's Blocks container does it: menus and custom fields are
// shadow blocks, so they have to be defined along with the blocks.
var handleExtensionAdded = function handleExtensionAdded(categoryInfo) {
  defineBlocks(categoryInfo, Object.getOwnPropertyNames(categoryInfo.customFieldTypes).map(function (name) {
    return categoryInfo.customFieldTypes[name].scratchBlocksDefinition;
  }));
  defineBlocks(categoryInfo, categoryInfo.menus);
  defineBlocks(categoryInfo, categoryInfo.blocks);
};
vm.addListener('EXTENSION_ADDED', handleExtensionAdded);
vm.addListener('BLOCKSINFO_UPDATE', handleExtensionAdded);
var latestXml = null;
vm.addListener('workspaceUpdate', function (data) {
  latestXml = data.xml;
});
var host = document.createElement('div');
// Laid out (Blockly measures text), but out of sight.
host.style.cssText = 'position:absolute;left:-10000px;top:0;width:2000px;height:2000px;';
document.body.appendChild(host);
var workspace = ScratchBlocks.inject(host, {
  readOnly: true,
  media: MEDIA_PATH,
  zoom: {
    controls: false,
    wheel: false,
    startScale: 1
  },
  scrollbars: false,
  trashcan: false,
  sounds: false,
  comments: true,
  colours: Object(_lib_themes__WEBPACK_IMPORTED_MODULE_4__["getColorsForTheme"])(_lib_themes__WEBPACK_IMPORTED_MODULE_4__["DEFAULT_THEME"])
});
var currentLocale = null;
var setLocale = function setLocale(locale) {
  var next = scratch_l10n_locales_editor_msgs__WEBPACK_IMPORTED_MODULE_1__["default"][locale] ? locale : 'en';
  if (next === currentLocale) return Promise.resolve();
  currentLocale = next;
  ScratchBlocks.ScratchMsgs.setLocale(next);
  // Extension block texts come from the VM's locale.
  return vm.setLocale(next, scratch_l10n_locales_editor_msgs__WEBPACK_IMPORTED_MODULE_1__["default"][next]);
};

// The scratch-blocks media (green flag, arrows, ...) are inlined as data
// URIs: the SVG is shown on another origin, possibly as an <img>.
var mediaCache = {};
var toDataUri = function toDataUri(url) {
  if (!mediaCache[url]) {
    mediaCache[url] = fetch(url).then(function (res) {
      return res.ok ? res.blob() : null;
    }).then(function (blob) {
      if (!blob) return url;
      return new Promise(function (resolve) {
        var reader = new FileReader();
        reader.onload = function () {
          return resolve(reader.result);
        };
        reader.onerror = function () {
          return resolve(url);
        };
        reader.readAsDataURL(blob);
      });
    }).catch(function () {
      return url;
    });
  }
  return mediaCache[url];
};
var inlineImages = function inlineImages(root) {
  var images = Array.prototype.slice.call(root.querySelectorAll('image'));
  return Promise.all(images.map(function (image) {
    var href = image.getAttributeNS(XLINK_NS, 'href') || image.getAttribute('href');
    if (!href || href.indexOf('data:') === 0) return null;
    var absolute = new URL(href, document.baseURI).href;
    return toDataUri(absolute).then(function (dataUri) {
      image.removeAttributeNS(XLINK_NS, 'href');
      image.setAttribute('href', dataUri);
    });
  }));
};

// Only the Blockly rules that match something in the image, so every SVG
// does not carry the whole editor stylesheet.
var collectCss = function collectCss(root) {
  var rules = [];
  Array.prototype.forEach.call(document.styleSheets, function (sheet) {
    var cssRules;
    try {
      cssRules = sheet.cssRules;
    } catch (e) {
      return;
    }
    Array.prototype.forEach.call(cssRules, function (rule) {
      if (!rule.selectorText || rule.selectorText.indexOf(':') !== -1) return;
      try {
        if (root.querySelector(rule.selectorText)) rules.push(rule.cssText);
      } catch (e) {
        // A selector querySelector does not know; not needed for a still image.
      }
    });
  });
  return rules.join('\n');
};
var unionBox = function unionBox(boxes) {
  var real = boxes.filter(function (b) {
    return b && (b.width > 0 || b.height > 0);
  });
  if (real.length === 0) return null;
  var x = Math.min.apply(null, real.map(function (b) {
    return b.x;
  }));
  var y = Math.min.apply(null, real.map(function (b) {
    return b.y;
  }));
  var right = Math.max.apply(null, real.map(function (b) {
    return b.x + b.width;
  }));
  var bottom = Math.max.apply(null, real.map(function (b) {
    return b.y + b.height;
  }));
  return {
    x: x,
    y: y,
    width: right - x,
    height: bottom - y
  };
};

/**
 * Loads one target into the workspace and copies its scripts out.
 * @param {RenderedTarget} target - The sprite or stage.
 * @returns {?object} Its name, bounding box and copied layers; null when it has no scripts.
 */
var snapshotTarget = function snapshotTarget(target) {
  // Not vm.setEditingTarget: it does nothing for the target already being
  // edited, and would announce the switch to a GUI there is none of.
  latestXml = null;
  vm.editingTarget = target;
  vm.runtime.setEditingTarget(target);
  vm.emitWorkspaceUpdate();
  if (!latestXml) return null;
  ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(ScratchBlocks.Xml.textToDom(latestXml), workspace);
  if (workspace.getTopBlocks(false).length === 0 && workspace.getTopComments(false).length === 0) {
    return null;
  }
  var canvas = workspace.getCanvas();
  var bubbles = workspace.getBubbleCanvas();
  var box = unionBox([canvas.getBBox(), bubbles.getBBox()]);
  if (!box) return null;
  var group = document.createElementNS(SVG_NS, 'g');
  [canvas, bubbles].forEach(function (layer) {
    var copy = layer.cloneNode(true);
    copy.removeAttribute('transform');
    group.appendChild(copy);
  });
  return {
    name: target.getName(),
    isStage: target.isStage,
    box: box,
    group: group
  };
};
var renderProject = function renderProject(project, locale) {
  return setLocale(locale).then(function () {
    return vm.loadProject(project);
  }).then(function () {
    // Sprites in the project's order, the stage last: what children build is in
    // their sprites, the stage rarely has scripts.
    var targets = vm.runtime.targets.filter(function (t) {
      return t.isOriginal;
    }).sort(function (a, b) {
      return a.isStage === b.isStage ? 0 : a.isStage ? 1 : -1;
    });
    var parts = targets.map(snapshotTarget).filter(Boolean);
    workspace.clear();
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('xmlns', SVG_NS);
    svg.setAttribute('xmlns:xlink', XLINK_NS);
    svg.setAttribute('class', 'blocklySvg');
    var defs = workspace.getParentSvg().querySelector('defs');
    if (defs) svg.appendChild(defs.cloneNode(true));
    var labelled = parts.length > 1;
    var y = PADDING;
    var width = 0;
    parts.forEach(function (part) {
      if (labelled) {
        var label = document.createElementNS(SVG_NS, 'text');
        label.setAttribute('x', PADDING);
        label.setAttribute('y', y + LABEL_HEIGHT * 0.65);
        label.setAttribute('fill', '#000000');
        label.setAttribute('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif');
        label.setAttribute('font-size', '20');
        label.setAttribute('font-weight', 'bold');
        label.textContent = part.name;
        svg.appendChild(label);
        y += LABEL_HEIGHT;
      }
      part.group.setAttribute('transform', "translate(".concat(PADDING - part.box.x, ", ").concat(y - part.box.y, ")"));
      svg.appendChild(part.group);
      y += part.box.height + TARGET_GAP;
      width = Math.max(width, part.box.width);
    });
    var totalWidth = Math.ceil(width + 2 * PADDING);
    var totalHeight = Math.ceil(parts.length ? y - TARGET_GAP + PADDING : 2 * PADDING);
    svg.setAttribute('width', totalWidth);
    svg.setAttribute('height', totalHeight);
    svg.setAttribute('viewBox', "0 0 ".concat(totalWidth, " ").concat(totalHeight));

    // The rules are matched against the copy while it is still in this
    // document, under the class the workspace's own svg has.
    host.appendChild(svg);
    var css = collectCss(svg);
    host.removeChild(svg);
    var style = document.createElementNS(SVG_NS, 'style');
    style.textContent = css;
    svg.insertBefore(style, svg.firstChild);
    return inlineImages(svg).then(function () {
      return {
        svg: new XMLSerializer().serializeToString(svg),
        width: totalWidth,
        height: totalHeight,
        targets: parts.length
      };
    });
  });
};
var queue = Promise.resolve();
window.addEventListener('message', function (event) {
  var msg = event.data;
  if (!msg || msg.type !== 'renderblocks' || !event.source) return;
  var reply = function reply(data) {
    event.source.postMessage(Object.assign({
      source: SOURCE,
      type: 'renderblocks',
      id: msg.id
    }, data), event.origin === 'null' ? '*' : event.origin);
  };
  queue = queue.then(function () {
    return renderProject(msg.project, msg.locale);
  }).then(reply, function (error) {
    return reply({
      error: error && error.message || String(error)
    });
  });
});
if (window.parent !== window) {
  window.parent.postMessage({
    source: SOURCE,
    type: 'renderready'
  }, '*');
}

/***/ }),

/***/ 2:
/*!*****************************************!*\
  !*** ../locale-data/index.js (ignored) ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 3:
/*!*******************************!*\
  !*** ./lib/locales (ignored) ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 4:
/*!*******************************!*\
  !*** ./lib/locales (ignored) ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 5:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 6:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 7:
/*!*********************************!*\
  !*** readable-stream (ignored) ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[["./src/playground/render.js","lib.min"]]]);
//# sourceMappingURL=render.js.map