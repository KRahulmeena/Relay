// import { Configuration, OpenAIApi } from "openai";

import OpenAI from 'openai';


import { auth } from "@clerk/nextjs";
import { error } from "console";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});


// const configuration = new Configuration({
//     apikey: process.env.OPENAI_API_KEY,
// })

// const openai = new OpenAIApi(Configuration);

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt, amount=1, resolution="512x512" } = body;

        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        // if (!Configuration.apikey) {
        //     return new NextResponse("Open Api key not configured", { status: 500 })
        // }

        if(!openai.apiKey) {
            return new NextResponse("Open Api key not configured", { status : 500 })
        }

        if (!prompt) {
            return new NextResponse("Prompt is required", { status: 400 });
        }
        if (!amount) {
            return new NextResponse("amount is required", { status: 400 });
        }
        if (!resolution) {
            return new NextResponse("resolution is required", { status: 400 });
        }

        const response = await openai.images.generate({
            prompt,
            n: parseInt(amount, 10),
            size: resolution,
        })

        // const response = await openai.chat.completions.create({
        //     model: "gpt-3.5-turbo",
        //     messages: [{"role": "user", "content": "Hello!"}],
        //   });

        //   console.log(response.choices[0].message);
        return NextResponse.json(response.data);

    } catch (errro) {
        console.log("[IMAGE_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}