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

const data: {
    title: string,
    description: React.ReactNode,
}[] = [
        {
            title: "Select a Template.",
            description: <>
                Browse our pre-built templates, or manually create a new one yourself from a
                list of exercises. <Link href="https://docs.workoutnotepad.co/templates" className="text-brand-500">Learn about workout templates</Link>.
            </>,
        },
        {
            title: "Follow the program.",
            description: <>
                Input your sets, reps, weight and/or time, and tag appropriately. Our platform
                gives you all the tools to accurately track your activity {" "}
                <Link href="https://docs.workoutnotepad.co/exercises/overview" className="text-brand-500">Learn about inputting exercise data</Link>.
            </>,
        },
        {
            title: "Post-workout report.",
            description: <>
                At the end of your workout, Workout Notepad will compile a visual report for you to analyze and share. {" "}
                <Link href="https://docs.workoutnotepad.co/workouts/sharing" className="text-brand-500">Learn more about workout reports</Link>.
            </>,
        },
        {
            title: "Advanced visualization.",
            description: <>
                Browse our pre-built dashboards and graphs to analyze your activity,
                or create your own using our powerful custom visualization tools. {" "} <Link href="https://docs.workoutnotepad.co/visualization/overview" className="text-brand-500">Learn more about visualization</Link>.
            </>,
        },
    ]

interface WNWelcomeEmailProps {
    recipient: string;
    unsubscribeLink: string;
}

const WNWelcomeEmail: React.FC<Readonly<WNWelcomeEmailProps>> = ({
    recipient,
    unsubscribeLink,
}) => (
    <WNWrapper
        preview="Congratulations! We are excited to see the progress you make using Workout Notepad."
        title="Welcome to Workout Notepad"
        recipient={recipient}
        unsubscribeLink={unsubscribeLink}
    >
        <Section>
            <Row>
                <Text className="text-base">
                    Congratulations! We are excited to see the progress you make
                    using Workout Notepad to plan, accelerate, and visualize your
                    exercise regimen.
                </Text>

                <Text className="text-base">Here's how to get started:</Text>
            </Row>
        </Section>

        <Section className="my-[16px]">
            {data.map((item, i) =>
                <Section key={i}>
                    <Hr className="mx-0 my-[24px] w-full border border-solid !border-gray-300" />
                    <Row>
                        <Column className="align-baseline">
                            <table className="text-center">
                                <td
                                    align="center"
                                    className="h-[40px] w-[40px] rounded-full bg-brand-200 p-0"
                                >
                                    <Text className="m-0 font-semibold text-brand">{i + 1}</Text>
                                </td>
                            </table>
                        </Column>
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
    </WNWrapper>
);

export default WNWelcomeEmail