import {
    Body,
    Column,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
    Tailwind,
} from "@react-email/components";
import * as React from "react";

interface WNWrapperProps {
    children: React.ReactNode;
    preview: string;
    title: string;
    recipient: string;
    unsubscribeLink: string;
}

export const WNWrapper: React.FC<Readonly<WNWrapperProps>> = ({
    children,
    preview,
    title,
    recipient,
    unsubscribeLink,
}) => (
    <Html>
        <Head />
        <Preview>{preview}</Preview>
        <Tailwind
            config={{
                theme: {
                    extend: {
                        colors: {
                            brand: { DEFAULT: '#418A2F', 50: '#EEF8EB', 100: '#DFF2DA', 200: '#C1E7B8', 300: '#A3DB96', 400: '#86CF73', 500: '#68C451', 600: '#51AC3B', 700: '#418A2F', 800: '#2B5C1F', 900: '#162F10', 950: '#0B1808' },
                            cell: {
                                DEFAULT: "#F5F0E6",
                                50: "#FCFAF6",
                                100: "#F9F7F1",
                                200: "#F5F0E6",
                                300: "#F1E9DB",
                                400: "#ECE3D0",
                                500: "#E8DCC5",
                                600: "#E4D6BA",
                                700: "#DFCFAF",
                                800: "#DBC9A4",
                                900: "#D6C29A",
                                950: "#D4BF94",
                            },
                            bg: {
                                DEFAULT: "#e1dcd2"
                            },
                            txt: {
                                DEFAULT: "#231f20"
                            },
                            offwhite: "#fafbfb",
                        },
                        spacing: {
                            0: "0px",
                            20: "20px",
                            45: "45px",
                        },
                    },
                },
            }}
        >
            <Body className="text-base font-sans">

                <Container className="p-20">
                    <Img
                        src={`https://pocketbase.sapphirenw.com/api/files/2v0pb1wl1ionpe7/esjnocozreqfkh3/workout_notepad_nSp4XBXCIL.png?thumb=0x100`}
                        width="60"
                        height="60"
                        alt="Logo"
                        className="mx-auto rounded-md"
                    />
                    <Heading className="text-center mt-20 leading-8 text-[24px] font-semibold text-gray-900">
                        {title}
                    </Heading>

                    {children}
                </Container>

                <Container className="mt-20">
                    <Text className="text-center text-gray-400 mb-45">
                        <Link href="https://workoutnotepad.co" className="text-gray-400 underline">workoutnotepad.co</Link> - Portland, OR
                    </Text>
                    {unsubscribeLink == "" ? null : <Text className="text-center text-sm text-brand-500">
                        <Link href={unsubscribeLink} className="text-gray-400 text-xs">Unsubscribe</Link>
                    </Text>}
                </Container>
            </Body>
        </Tailwind>
    </Html>
);

export default WNWrapper