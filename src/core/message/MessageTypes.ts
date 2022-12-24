import { GenericType } from "../util/GenericType";

export class MessageType extends GenericType {
    
}

export const MESSAGE_TYPE_NORMAL: MessageType = new MessageType("normal", "普通");
export const MESSAGE_TYPE_COLLAPSE: MessageType = new MessageType("collapse", "折叠");