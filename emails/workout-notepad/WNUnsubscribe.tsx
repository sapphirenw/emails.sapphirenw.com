import {
    Row,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";
import { WNWrapper } from "./WNWrapper";

interface WNUnsubscribeProps {
    recipient: string;
}

const WNUnsubscribe: React.FC<Readonly<WNUnsubscribeProps>> = ({
    recipient,
}) => (
    <WNWrapper
        preview="You have been successfully unsubscribed"
        title="Successfully Unsubscribed"
        recipient={recipient}
        unsubscribeLink={""}
    >
        <Section>
            <Row>
                <Text className="text-base opacity-75 text-center">
                    We are sorry to see you go! You have been successfully unsubscribed from all
                    future marketing and notification related emails for Workout Notepad.
                </Text>
            </Row>
        </Section>
    </WNWrapper>
);

export default WNUnsubscribe