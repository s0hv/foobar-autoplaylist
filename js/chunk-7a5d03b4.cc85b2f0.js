(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7a5d03b4"],{2400:function(t,e,i){"use strict";i("e162")},"4c72":function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-container",{staticClass:"flex query-row"},[i("v-row",{staticClass:"flex-nowrap"},[i("v-checkbox",{attrs:{label:"NOT"},model:{value:t.query.negated,callback:function(e){t.$set(t.query,"negated",e)},expression:"query.negated"}}),i("div",{staticClass:"spacing-18"}),i("v-combobox",{staticClass:"search resizable  field",attrs:{items:t.timeFields,label:"Field"},model:{value:t.query.field,callback:function(e){t.$set(t.query,"field",e)},expression:"query.field"}}),i("v-combobox",{staticClass:"operator resizable",attrs:{items:t.operators,label:"Operator"},model:{value:t.query.comparator,callback:function(e){t.$set(t.query,"comparator",e)},expression:"query.comparator"}}),i("TimeInput",{staticClass:"search resizable",on:{input:t.timeChange}})],1),i("comparator",{attrs:{query:t.query}})],1)},a=[],n=i("d4ec"),r=i("bee2"),l=i("257e"),o=i("262e"),c=i("2caf"),u=i("ade3"),h=(i("99af"),i("07ac"),i("9ab4")),d=i("2fe1"),m=i("2b0e"),b=i("e881"),v=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"time-input"},[i("v-text-field",{directives:[{name:"mask",rawName:"v-mask",value:t.timeMask,expression:"timeMask"}],attrs:{label:t.timeLabel,messages:"Time"},on:{change:t.timeChanged},model:{value:t.time,callback:function(e){t.time=e},expression:"time"}}),i("v-slider",{staticClass:"pa-horizontal-10",attrs:{max:t.tickLabels.length-1,"tick-labels":t.tickLabels,ticks:"always","tick-size":"4"},on:{change:t.updateMask},model:{value:t.accuracy,callback:function(e){t.accuracy=e},expression:"accuracy"}})],1)},p=[],f=(i("ac1f"),i("5319"),["Years","Months","Days","Hours","Minute","Second"]),k={0:"YYYY",1:"YYYY-MM",2:"YYYY-MM-DD",3:"YYYY-MM-DD hh",4:"YYYY-MM-DD hh:mm",5:"YYYY-MM-DD hh:mm:ss"},g={0:"####",1:"####-##",2:"####-##-##",3:"####-##-## ##",4:"####-##-## ##:##",5:"####-##-## ##:##:##"},y=function(t){Object(o["a"])(i,t);var e=Object(c["a"])(i);function i(){var t;Object(n["a"])(this,i);for(var s=arguments.length,a=new Array(s),r=0;r<s;r++)a[r]=arguments[r];return t=e.call.apply(e,[this].concat(a)),Object(u["a"])(Object(l["a"])(t),"time",""),Object(u["a"])(Object(l["a"])(t),"timeMask",g[0]),Object(u["a"])(Object(l["a"])(t),"timeLabel",k[0]),Object(u["a"])(Object(l["a"])(t),"tickLabels",f),Object(u["a"])(Object(l["a"])(t),"accuracy",""),t}return Object(r["a"])(i,[{key:"mounted",value:function(){this.time=this.$props.value}},{key:"updateMask",value:function(t){this.timeMask=g[t],this.timeLabel=k[t]}},{key:"trimTime",value:function(t){return t.replace(/[:\- ]$/g,"")}},{key:"timeChanged",value:function(t){this.$emit("input",this.trimTime(t))}}]),i}(m["a"]);y=Object(h["a"])([Object(d["a"])({props:{value:String}})],y);var C=y,O=C,w=(i("2400"),i("2877")),$=i("6544"),x=i.n($),V=i("5530"),j=(i("a9e3"),i("acd8"),i("26e9"),i("d81d"),i("4795"),i("caad"),i("2532"),i("498a"),i("0d03"),i("d3b7"),i("25f0"),i("c975"),i("b680"),i("9e29"),i("c37a")),M=i("0789"),S=i("58df"),T=i("297c"),_=i("a293"),Y=i("80d2"),D=i("d9bd"),F=Object(S["a"])(j["a"],T["a"]).extend({name:"v-slider",directives:{ClickOutside:_["a"]},mixins:[T["a"]],props:{disabled:Boolean,inverseLabel:Boolean,max:{type:[Number,String],default:100},min:{type:[Number,String],default:0},step:{type:[Number,String],default:1},thumbColor:String,thumbLabel:{type:[Boolean,String],default:void 0,validator:function(t){return"boolean"===typeof t||"always"===t}},thumbSize:{type:[Number,String],default:32},tickLabels:{type:Array,default:function(){return[]}},ticks:{type:[Boolean,String],default:!1,validator:function(t){return"boolean"===typeof t||"always"===t}},tickSize:{type:[Number,String],default:2},trackColor:String,trackFillColor:String,value:[Number,String],vertical:Boolean},data:function(){return{app:null,oldValue:null,thumbPressed:!1,mouseTimeout:-1,isFocused:!1,isActive:!1,noClick:!1,startOffset:0}},computed:{classes:function(){return Object(V["a"])(Object(V["a"])({},j["a"].options.computed.classes.call(this)),{},{"v-input__slider":!0,"v-input__slider--vertical":this.vertical,"v-input__slider--inverse-label":this.inverseLabel})},internalValue:{get:function(){return this.lazyValue},set:function(t){t=isNaN(t)?this.minValue:t;var e=this.roundValue(Math.min(Math.max(t,this.minValue),this.maxValue));e!==this.lazyValue&&(this.lazyValue=e,this.$emit("input",e))}},trackTransition:function(){return this.thumbPressed?this.showTicks||this.stepNumeric?"0.1s cubic-bezier(0.25, 0.8, 0.5, 1)":"none":""},minValue:function(){return parseFloat(this.min)},maxValue:function(){return parseFloat(this.max)},stepNumeric:function(){return this.step>0?parseFloat(this.step):0},inputWidth:function(){return(this.roundValue(this.internalValue)-this.minValue)/(this.maxValue-this.minValue)*100},trackFillStyles:function(){var t,e=this.vertical?"bottom":"left",i=this.vertical?"top":"right",s=this.vertical?"height":"width",a=this.$vuetify.rtl?"auto":"0",n=this.$vuetify.rtl?"0":"auto",r=this.isDisabled?"calc(".concat(this.inputWidth,"% - 10px)"):"".concat(this.inputWidth,"%");return t={transition:this.trackTransition},Object(u["a"])(t,e,a),Object(u["a"])(t,i,n),Object(u["a"])(t,s,r),t},trackStyles:function(){var t,e=this.vertical?this.$vuetify.rtl?"bottom":"top":this.$vuetify.rtl?"left":"right",i=this.vertical?"height":"width",s="0px",a=this.isDisabled?"calc(".concat(100-this.inputWidth,"% - 10px)"):"calc(".concat(100-this.inputWidth,"%)");return t={transition:this.trackTransition},Object(u["a"])(t,e,s),Object(u["a"])(t,i,a),t},showTicks:function(){return this.tickLabels.length>0||!(this.isDisabled||!this.stepNumeric||!this.ticks)},numTicks:function(){return Math.ceil((this.maxValue-this.minValue)/this.stepNumeric)},showThumbLabel:function(){return!this.isDisabled&&!(!this.thumbLabel&&!this.$scopedSlots["thumb-label"])},computedTrackColor:function(){if(!this.isDisabled)return this.trackColor?this.trackColor:this.isDark?this.validationState:this.validationState||"primary lighten-3"},computedTrackFillColor:function(){if(!this.isDisabled)return this.trackFillColor?this.trackFillColor:this.validationState||this.computedColor},computedThumbColor:function(){return this.thumbColor?this.thumbColor:this.validationState||this.computedColor}},watch:{min:function(t){var e=parseFloat(t);e>this.internalValue&&this.$emit("input",e)},max:function(t){var e=parseFloat(t);e<this.internalValue&&this.$emit("input",e)},value:{handler:function(t){this.internalValue=t}}},beforeMount:function(){this.internalValue=this.value},mounted:function(){this.app=document.querySelector("[data-app]")||Object(D["c"])("Missing v-app or a non-body wrapping element with the [data-app] attribute",this)},methods:{genDefaultSlot:function(){var t=[this.genLabel()],e=this.genSlider();return this.inverseLabel?t.unshift(e):t.push(e),t.push(this.genProgress()),t},genSlider:function(){return this.$createElement("div",{class:Object(V["a"])({"v-slider":!0,"v-slider--horizontal":!this.vertical,"v-slider--vertical":this.vertical,"v-slider--focused":this.isFocused,"v-slider--active":this.isActive,"v-slider--disabled":this.isDisabled,"v-slider--readonly":this.isReadonly},this.themeClasses),directives:[{name:"click-outside",value:this.onBlur}],on:{click:this.onSliderClick,mousedown:this.onSliderMouseDown,touchstart:this.onSliderMouseDown}},this.genChildren())},genChildren:function(){return[this.genInput(),this.genTrackContainer(),this.genSteps(),this.genThumbContainer(this.internalValue,this.inputWidth,this.isActive,this.isFocused,this.onFocus,this.onBlur)]},genInput:function(){return this.$createElement("input",{attrs:Object(V["a"])({value:this.internalValue,id:this.computedId,disabled:!0,readonly:!0,tabindex:-1},this.$attrs)})},genTrackContainer:function(){var t=[this.$createElement("div",this.setBackgroundColor(this.computedTrackColor,{staticClass:"v-slider__track-background",style:this.trackStyles})),this.$createElement("div",this.setBackgroundColor(this.computedTrackFillColor,{staticClass:"v-slider__track-fill",style:this.trackFillStyles}))];return this.$createElement("div",{staticClass:"v-slider__track-container",ref:"track"},t)},genSteps:function(){var t=this;if(!this.step||!this.showTicks)return null;var e=parseFloat(this.tickSize),i=Object(Y["g"])(this.numTicks+1),s=this.vertical?"bottom":this.$vuetify.rtl?"right":"left",a=this.vertical?this.$vuetify.rtl?"left":"right":"top";this.vertical&&i.reverse();var n=i.map((function(i){var n,r=[];t.tickLabels[i]&&r.push(t.$createElement("div",{staticClass:"v-slider__tick-label"},t.tickLabels[i]));var l=i*(100/t.numTicks),o=t.$vuetify.rtl?100-t.inputWidth<l:l<t.inputWidth;return t.$createElement("span",{key:i,staticClass:"v-slider__tick",class:{"v-slider__tick--filled":o},style:(n={width:"".concat(e,"px"),height:"".concat(e,"px")},Object(u["a"])(n,s,"calc(".concat(l,"% - ").concat(e/2,"px)")),Object(u["a"])(n,a,"calc(50% - ".concat(e/2,"px)")),n)},r)}));return this.$createElement("div",{staticClass:"v-slider__ticks-container",class:{"v-slider__ticks-container--always-show":"always"===this.ticks||this.tickLabels.length>0}},n)},genThumbContainer:function(t,e,i,s,a,n){var r=arguments.length>6&&void 0!==arguments[6]?arguments[6]:"thumb",l=[this.genThumb()],o=this.genThumbLabelContent(t);return this.showThumbLabel&&l.push(this.genThumbLabel(o)),this.$createElement("div",this.setTextColor(this.computedThumbColor,{ref:r,key:r,staticClass:"v-slider__thumb-container",class:{"v-slider__thumb-container--active":i,"v-slider__thumb-container--focused":s,"v-slider__thumb-container--show-label":this.showThumbLabel},style:this.getThumbContainerStyles(e),attrs:Object(V["a"])({role:"slider",tabindex:this.isDisabled?-1:this.$attrs.tabindex?this.$attrs.tabindex:0,"aria-label":this.label,"aria-valuemin":this.min,"aria-valuemax":this.max,"aria-valuenow":this.internalValue,"aria-readonly":String(this.isReadonly),"aria-orientation":this.vertical?"vertical":"horizontal"},this.$attrs),on:{focus:a,blur:n,keydown:this.onKeyDown}}),l)},genThumbLabelContent:function(t){return this.$scopedSlots["thumb-label"]?this.$scopedSlots["thumb-label"]({value:t}):[this.$createElement("span",[String(t)])]},genThumbLabel:function(t){var e=Object(Y["f"])(this.thumbSize),i=this.vertical?"translateY(20%) translateY(".concat(Number(this.thumbSize)/3-1,"px) translateX(55%) rotate(135deg)"):"translateY(-20%) translateY(-12px) translateX(-50%) rotate(45deg)";return this.$createElement(M["d"],{props:{origin:"bottom center"}},[this.$createElement("div",{staticClass:"v-slider__thumb-label-container",directives:[{name:"show",value:this.isFocused||this.isActive||"always"===this.thumbLabel}]},[this.$createElement("div",this.setBackgroundColor(this.computedThumbColor,{staticClass:"v-slider__thumb-label",style:{height:e,width:e,transform:i}}),[this.$createElement("div",t)])])])},genThumb:function(){return this.$createElement("div",this.setBackgroundColor(this.computedThumbColor,{staticClass:"v-slider__thumb"}))},getThumbContainerStyles:function(t){var e=this.vertical?"top":"left",i=this.$vuetify.rtl?100-t:t;return i=this.vertical?100-i:i,Object(u["a"])({transition:this.trackTransition},e,"".concat(i,"%"))},onSliderMouseDown:function(t){var e,i=this;if(t.preventDefault(),this.oldValue=this.internalValue,this.isActive=!0,null!=(e=t.target)&&e.matches(".v-slider__thumb-container, .v-slider__thumb-container *")){this.thumbPressed=!0;var s=t.target.getBoundingClientRect(),a="touches"in t?t.touches[0]:t;this.startOffset=this.vertical?a.clientY-(s.top+s.height/2):a.clientX-(s.left+s.width/2)}else this.startOffset=0,window.clearTimeout(this.mouseTimeout),this.mouseTimeout=window.setTimeout((function(){i.thumbPressed=!0}),300);var n=!Y["w"]||{passive:!0,capture:!0},r=!!Y["w"]&&{passive:!0},l="touches"in t;this.onMouseMove(t),this.app.addEventListener(l?"touchmove":"mousemove",this.onMouseMove,r),Object(Y["a"])(this.app,l?"touchend":"mouseup",this.onSliderMouseUp,n),this.$emit("start",this.internalValue)},onSliderMouseUp:function(t){t.stopPropagation(),window.clearTimeout(this.mouseTimeout),this.thumbPressed=!1;var e=!!Y["w"]&&{passive:!0};this.app.removeEventListener("touchmove",this.onMouseMove,e),this.app.removeEventListener("mousemove",this.onMouseMove,e),this.$emit("mouseup",t),this.$emit("end",this.internalValue),Object(Y["i"])(this.oldValue,this.internalValue)||(this.$emit("change",this.internalValue),this.noClick=!0),this.isActive=!1},onMouseMove:function(t){"mousemove"===t.type&&(this.thumbPressed=!0),this.internalValue=this.parseMouseMove(t)},onKeyDown:function(t){if(this.isInteractive){var e=this.parseKeyDown(t,this.internalValue);null==e||e<this.minValue||e>this.maxValue||(this.internalValue=e,this.$emit("change",e))}},onSliderClick:function(t){if(this.noClick)this.noClick=!1;else{var e=this.$refs.thumb;e.focus(),this.onMouseMove(t),this.$emit("change",this.internalValue)}},onBlur:function(t){this.isFocused=!1,this.$emit("blur",t)},onFocus:function(t){this.isFocused=!0,this.$emit("focus",t)},parseMouseMove:function(t){var e=this.vertical?"top":"left",i=this.vertical?"height":"width",s=this.vertical?"clientY":"clientX",a=this.$refs.track.getBoundingClientRect(),n=a[e],r=a[i],l="touches"in t?t.touches[0][s]:t[s],o=Math.min(Math.max((l-n-this.startOffset)/r,0),1)||0;return this.vertical&&(o=1-o),this.$vuetify.rtl&&(o=1-o),parseFloat(this.min)+o*(this.maxValue-this.minValue)},parseKeyDown:function(t,e){if(this.isInteractive){var i=Y["s"].pageup,s=Y["s"].pagedown,a=Y["s"].end,n=Y["s"].home,r=Y["s"].left,l=Y["s"].right,o=Y["s"].down,c=Y["s"].up;if([i,s,a,n,r,l,o,c].includes(t.keyCode)){t.preventDefault();var u=this.stepNumeric||1,h=(this.maxValue-this.minValue)/u;if([r,l,o,c].includes(t.keyCode)){var d=this.$vuetify.rtl?[r,c]:[l,c],m=d.includes(t.keyCode)?1:-1,b=t.shiftKey?3:t.ctrlKey?2:1;e+=m*u*b}else if(t.keyCode===n)e=this.minValue;else if(t.keyCode===a)e=this.maxValue;else{var v=t.keyCode===s?1:-1;e-=v*u*(h>100?h/10:10)}return e}}},roundValue:function(t){if(!this.stepNumeric)return t;var e=this.step.toString().trim(),i=e.indexOf(".")>-1?e.length-e.indexOf(".")-1:0,s=this.minValue%this.stepNumeric,a=Math.round((t-s)/this.stepNumeric)*this.stepNumeric+s;return parseFloat(Math.min(a,this.maxValue).toFixed(i))}}}),L=i("8654"),E=Object(w["a"])(O,v,p,!1,null,"73d90c1e",null),N=E.exports;x()(E,{VSlider:F,VTextField:L["a"]});var z=i("d8cd"),q=i("48d8"),B=function(t){Object(o["a"])(i,t);var e=Object(c["a"])(i);function i(){var t;Object(n["a"])(this,i);for(var s=arguments.length,a=new Array(s),r=0;r<s;r++)a[r]=arguments[r];return t=e.call.apply(e,[this].concat(a)),Object(u["a"])(Object(l["a"])(t),"operators",Object.values(b["f"])),Object(u["a"])(Object(l["a"])(t),"timeFields",z["e"]),Object(u["a"])(Object(l["a"])(t),"$props",void 0),t}return Object(r["a"])(i,[{key:"timeChange",value:function(t){this.$props.query.comparedAgainst=t}}]),i}(m["a"]);B=Object(h["a"])([Object(d["a"])({components:{Comparator:q["a"],TimeInput:N},props:{query:{type:Object}}})],B);var A=B,P=A,W=i("ac7c"),I=i("2b5d"),K=i("a523"),R=i("0fd9"),X=Object(w["a"])(P,s,a,!1,null,"6a93c936",null);e["default"]=X.exports;x()(X,{VCheckbox:W["a"],VCombobox:I["a"],VContainer:K["a"],VRow:R["a"]})},"9e29":function(t,e,i){},e162:function(t,e,i){}}]);
//# sourceMappingURL=chunk-7a5d03b4.cc85b2f0.js.map