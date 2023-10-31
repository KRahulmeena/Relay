// import { Configuration, OpenAIApi } from "openai";

import OpenAI from 'openai';


import { auth } from "@clerk/nextjs";
import { error } from "console";
import { NextResponse } from "next/server";
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});


// const configuration = new Configuration({
//     apikey: process.env.OPENAI_API_KEY,
// })

// const openai = new OpenAIApi(Configuration);

const instrucationMessage: ChatCompletionMessageParam = {
    role: "system",
    content: "You are a code Generator. You must answer of the question using code Generator with the snippets."
}

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { message } = body;

        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        // if (!Configuration.apikey) {
        //     return new NextResponse("Open Api key not configured", { status: 500 })
        // }

        if (!openai.apiKey) {
            return new NextResponse("Open Api key not configured", { status: 500 })
        }

        if (!message) {
            return new NextResponse("Message are required", { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [instrucationMessage, ...message],
        });

        //   console.log(response.choices[0].message);
        return NextResponse.json(response.choices[0].message);

    } catch (errro) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}