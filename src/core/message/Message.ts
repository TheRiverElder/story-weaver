import { Int, Text } from "../BasicTypes";
import { MessageType } from "./MessageTypes";

export interface Message {
    type: MessageType;
    timestamp: Int;
    text: Text;
}