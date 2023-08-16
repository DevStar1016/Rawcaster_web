import { PickerProps } from "emoji-mart";
import {EmojiSkinTonePositionTypes,EmojiThemeTypes} from "./Datatypes"
const EmojipositionTypes  = "top"|"bottom"|"none"

  export interface EmojiPickerProps extends PickerProps {
    data?:any;
    i18n?:any;
    categories?:String[];
    custom?:String[];
    onEmojiSelect:(e:any)=>Void;
    onClickOutside?:()=>Void;
    onAddCustomEmoji?:()=>Void;
    autoFocus?:boolean;
    categoryIcons?:any;
    dynamicWidth?:Boolean;
    emojiButtonColors?:String[];
    emojiButtonRadius?:String;
    emojiButtonSize?:Number;
    emojiSize?:Number;
    emojiVersion?:Number;
    exceptEmojis?:String[];
    icons?:"auto"|"outline"|"solid";
    locale?:String;
    maxFrequentRows?:Number;
    navPosition?:"top"|"bottom"|"none";
    noResultsEmoji?:String;
    perLine?:Number;
    previewEmoji?:String;
    previewPosition?:"top"|"bottom"|"none";
    searchPosition?:"sticky"|"static"|"none";
    set?: "native"|"apple"|"facebook"|"google"|"twitter";
    skinTonePosition?: "preview" | "search" | "none";
    theme?:"auto" | "light" | "dark";
  }
  