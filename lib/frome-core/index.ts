/*
 * FROME CORE
 * Arquitectura Cognitiva Propiedad de Esmeralda García
 * 
 * Este módulo implementa:
 * - Estado cognitivo persistente
 * - Memoria estructural por proyecto
 * - Gobernanza básica
 * - Orquestación hacia Anthropic Claude API
 */

import { prisma } from "@/lib/prisma";

/* ================================
   Tipos Base
================================ */

export type CognitiveState = {
  projectId: string;
  objectives: string[];
  constraints: string[];
  contextSummary: string;
  lastUpdated: number;
};

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
};

export type ProjectMemory = {
  state: CognitiveState;
  messages: Message[];
};

/* ================================
   Database Operations
================================ */

async function getOrCreateProject(projectId: string): Promise<ProjectMemory> {
  let project = await prisma.fromEProject.findUnique({
    where: { id: projectId },
    include: { messages: true },
  });

  if (!project) {
    project = await prisma.fromEProject.create({
      data: {
        id: projectId,
        objectives: [],
        constraints: [],
        contextSummary: "",
      },
      include: { messages: true },
    });
  }

  // Convert to ProjectMemory format
  return {
    state: {
      projectId: project.id,
      objectives: project.objectives as string[],
      constraints: project.constraints as string[],
      contextSummary: project.contextSummary,
      lastUpdated: project.lastUpdated.getTime(),
    },
    messages: project.messages.map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
      timestamp: m.timestamp.getTime(),
    })),
  };
}

async function saveMessage(
  projectId: string,
  role: "user" | "assistant" | "system",
  content: string
) {
  await prisma.fromEMessage.create({
    data: {
      projectId,
      role,
      content,
    },
  });
}

async function updateProjectState(
  projectId: string,
  state: Partial<CognitiveState>
) {
  await prisma.fromEProject.update({
    where: { id: projectId },
    data: {
      objectives: state.objectives,
      constraints: state.constraints,
      contextSummary: state.contextSummary,
      lastUpdated: new Date(),
    },
  });
}

/* ================================
   CORE COGNITIVO FROME
================================ */

export class FromECore {
  async processInput(projectId: string, userInput: string): Promise<string> {
    // Get or create project
    const project = await getOrCreateProject(projectId);

    // Persist user message
    await saveMessage(projectId, "user", userInput);
    project.messages.push({
      id: crypto.randomUUID(),
      role: "user",
      content: userInput,
      timestamp: Date.now(),
    });

    // Update cognitive state
    await this.updateState(project, userInput);

    // Build structured context
    const structuredContext = this.buildContext(project);

    // Call Claude API
    const response = await this.callModel(structuredContext);

    // Persist assistant response
    await saveMessage(projectId, "assistant", response);

    return response;
  }

  async updateState(project: ProjectMemory, input: string) {
    // Detect explicit objectives
    if (input.toLowerCase().includes("objetivo")) {
      project.state.objectives.push(input);
    }

    // Detect constraints
    if (
      input.toLowerCase().includes("restricción") ||
      input.toLowerCase().includes("limitación")
    ) {
      project.state.constraints.push(input);
    }

    // Update context summary (last 5 messages)
    project.state.contextSummary = project.messages
      .slice(-5)
      .map((m) => m.content)
      .join(" ");

    // Save to database
    await updateProjectState(project.state.projectId, project.state);
  }

  buildContext(project: ProjectMemory) {
    return {
      system: `FromE es una arquitectura cognitiva propiedad de Esmeralda García.
Mantén coherencia estructural en todas las respuestas.
Respeta los objetivos activos y las restricciones del proyecto.

Objetivos activos:
${project.state.objectives.map((o, i) => `${i + 1}. ${o}`).join("\n")}

Restricciones:
${project.state.constraints.map((c, i) => `${i + 1}. ${c}`).join("\n")}

Resumen del contexto:
${project.state.contextSummary}`,
      messages: project.messages.slice(-10), // Last 10 messages
    };
  }

  async callModel(context: any): Promise<string> {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY no configurada");
    }

    // Prepare messages for Claude API
    const messages = [
      {
        role: "user" as const,
        content: context.system,
      },
      ...context.messages.map((m: Message) => ({
        role: m.role === "system" ? ("user" as const) : (m.role as "user" | "assistant"),
        content: m.content,
      })),
    ];

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          messages,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Claude API error: ${error}`);
      }

      const data = await response.json();
      return data.content[0].text || "";
    } catch (error) {
      console.error("Error calling Claude API:", error);
      throw error;
    }
  }

  async getProjectState(projectId: string): Promise<CognitiveState | null> {
    const project = await prisma.fromEProject.findUnique({
      where: { id: projectId },
    });

    if (!project) return null;

    return {
      projectId: project.id,
      objectives: project.objectives as string[],
      constraints: project.constraints as string[],
      contextSummary: project.contextSummary,
      lastUpdated: project.lastUpdated.getTime(),
    };
  }
}
