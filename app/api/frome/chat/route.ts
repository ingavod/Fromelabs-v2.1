import { NextRequest, NextResponse } from "next/server";
import { FromECore } from "@/lib/frome-core";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    // Authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // Parse request body
    const { projectId, text } = await req.json();

    // Validation
    if (!projectId || typeof projectId !== "string") {
      return NextResponse.json(
        { error: "projectId es requerido y debe ser un string" },
        { status: 400 }
      );
    }

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "text es requerido y debe ser un string" },
        { status: 400 }
      );
    }

    if (text.length > 10000) {
      return NextResponse.json(
        { error: "El texto no puede exceder 10000 caracteres" },
        { status: 400 }
      );
    }

    // Process with FromE Core
    const core = new FromECore();
    const output = await core.processInput(projectId, text);

    return NextResponse.json({
      success: true,
      output,
      projectId,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error("FromE Core error:", error);
    return NextResponse.json(
      {
        error: "Error procesando la solicitud",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
