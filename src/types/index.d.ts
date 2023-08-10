import { EmEmojiprops } from "./Events";


declare global {
    namespace JSX {
        interface IntrinsicElements {
          'em-emoji': EmEmojiprops
        }
      }
  }
  
  export {};