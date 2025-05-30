import {
    Column,
    Link,
    Row,
    Section,
    Text,
    Hr,
} from "@react-email/components";
import * as React from "react";
import { WNWrapper } from "./WNWrapper";

interface WNReEngagementProps {
    recipient: string;
    unsubscribeLink: string;
}

const data: {
    title: string,
    description: React.ReactNode,
}[] = [
        {
            title: "Expert-Made Templates",
            description: <>
                Browse our pre-built templates, or manually create a new one yourself from a
                list of exercises. <Link href="https://docs.workoutnotepad.co/templates" className="text-brand-500">Learn about workout templates</Link>.
            </>,
        },
        {
            title: "New and Improved Graphs",
            description: <>
                We have the best data visualization in the game. We have over 50 chars that breakdown your
                exercise progress to start, along with a fully featured graph builder to create and save your own charts.
            </>,
        },
        {
            title: "Post-workout reports",
            description: <>
                At the end of your workout, Workout Notepad will compile a visual report for you to analyze and share. {" "}
                <Link href="https://docs.workoutnotepad.co/workouts/sharing" className="text-brand-500">Learn more about workout reports</Link>.
            </>,
        },
    ]

const WNReEngagementEmail: React.FC<Readonly<WNReEngagementProps>> = ({
    recipient,
    unsubscribeLink,
}) => (
    <WNWrapper
        preview="It has been a while since we last saw you, can we help you get back on track?"
        title="Hey! We Miss You"
        recipient={recipient}
        unsubscribeLink={unsubscribeLink}
    >
        <Section>
            <Row>
                <Text className="text-base">
                    It has been a while since the last time we saw you, what can we do to
                    convince you to use us again? Our app has improved a lot since the last
                    time you tried it out!
                </Text>

                <Text className="text-base">
                    In addition, we would love to give you a promo code valid for 3 months
                    of premium so you can fully experience the features of our app.
                </Text>

                <Text className="text-base">
                    Ensure your app is up to date, navigate to settings, then input this
                    promotion code to redeem your 3 months: (code: WEMISSYOU)
                </Text>

                <Section className="grid place-items-center">
                    <table className="text-center">
                        <td
                            align="center"
                            className="rounded-md bg-brand-200 px-6 py-3"
                        >
                            <Text className="m-0 font-semibold text-brand">WEMISSYOU</Text>
                        </td>
                    </table>
                </Section>

                <Text className="text-base">In short, we have:</Text>

                <Section className="my-[8px]">
                    {data.map((item, i) =>
                        <Section key={i}>
                            <Hr className="mx-0 my-[16px] w-full border border-solid !border-gray-300" />
                            <Row>
                                <Column className="w-[90%]">
                                    <Text className="m-0 text-[20px] font-semibold leading-[28px] text-gray-900">
                                        {item.title}
                                    </Text>
                                    <Text className="m-0 mt-[8px] text-[16px] leading-[24px] text-gray-500">
                                        {item.description}
                                    </Text>
                                </Column>
                            </Row>
                        </Section>
                    )}
                </Section>
            </Row>
        </Section>

        <Section className="my-[16px]">

        </Section>
    </WNWrapper>
);

export default WNReEngagementEmail