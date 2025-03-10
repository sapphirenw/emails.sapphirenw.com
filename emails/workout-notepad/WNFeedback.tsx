import {
    Column,
    Link,
    Row,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";
import { WNWrapper } from "./WNWrapper";

interface WNFeedbackProps {
    recipient: string;
    unsubscribeLink: string;
    userId: string;
}

const WNFeedback: React.FC<Readonly<WNFeedbackProps>> = ({
    recipient,
    unsubscribeLink,
    userId,
}) => (
    <WNWrapper
        preview="Thank you for trying Workout Notepad! We would love to hear how you like our app"
        title="How are things going?"
        recipient={recipient}
        unsubscribeLink={unsubscribeLink}
    >
        <Section>
            <Row>
                <Text className="text-base">
                    Thank you for trying out Workout Notepad! We are an enthusiastic team
                    hoping to create the best workout tracking experience for all types of people.
                </Text>
                <Text className="text-base">
                    With that, we are asking for your help! You (hopefully) have been using this app,
                    and we would love to hear what worked, didn't work, and could improve
                    in our app. That way, instead of building the features WE want, we can focus on the
                    pain points that YOU have.
                </Text>
                <Text className="text-base">
                    Contributing is easy, and all it takes is giving us a single click feedback below,
                    and optionally filling out a form that we have attached.
                </Text>
            </Row>
        </Section>

        <Section className="my-[16px]">
            <Text className="text-base">How has Workout Notepad been working for you?</Text>
            <Section className="rounded-md overflow-hidden">
                <Row>
                    <Column className="w-[25%] h-10 bg-brand-50">
                        <Link href={`https://api2.workoutnotepad.co/public/feedback?email=${recipient}&userId=${userId}&status=bad`}>
                            <Text className="m-0 text-center text-slate-600">Bad</Text>
                        </Link>
                    </Column>
                    <Column className="w-[25%] h-10 bg-brand-100">
                        <Link href={`https://api2.workoutnotepad.co/public/feedback?email=${recipient}&userId=${userId}&status=okay`}>
                            <Text className="m-0 text-center text-slate-600">Okay</Text>
                        </Link>
                    </Column>
                    <Column className="w-[25%] h-10 bg-brand-200">
                        <Link href={`https://api2.workoutnotepad.co/public/feedback?email=${recipient}&userId=${userId}&status=good`}>
                            <Text className="m-0 text-center text-slate-600">Good</Text>
                        </Link>
                    </Column>
                    <Column className="w-[25%] h-10 bg-brand-300">
                        <Link href={`https://api2.workoutnotepad.co/public/feedback?email=${recipient}&userId=${userId}&status=great`}>
                            <Text className="m-0 text-center text-slate-600">Great</Text>
                        </Link>
                    </Column>
                </Row>
            </Section>
        </Section>

        <Section className="mt-[32px]">
            <Link className="m-0" href={`https://forms.sapphirenw.com/s/ct87vzkg25ped9mb57fldcvh?x-email=${recipient}&x-user-id=${userId}`}>
                <Text className="m-0 text-xs text-center">Click here to fill out our full feedback form.</Text>
            </Link>
            <Text className="m-0 pt-4 text-xs text-slate-500">(Est time ~2 minutes)</Text>
            <Text className="m-0 text-xs text-slate-500">Filling out this form will NOT increase the frequency in which we contact you.</Text>
        </Section>
    </WNWrapper>
);

export default WNFeedback