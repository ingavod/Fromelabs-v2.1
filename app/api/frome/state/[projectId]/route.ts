import { NextRequest, NextResponse } from "next/server";
import { FromECore } from "@/lib/frome-core";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    // Authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const { projectId } = params;

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId es requerido" },
        { status: 400 }
      );
    }

    // Get project state
    const core = new FromECore();
    const state = await core.getProjectState(projectId);

    if (!state) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      state,
    });
  } catch (error: any) {
    console.error("Error getting project state:", error);
    return NextResponse.json(
      {
        error: "Error obteniendo el estado del proyecto",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
