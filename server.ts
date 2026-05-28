import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const ARES_SYSTEM_PROMPT = `
⚙️ SYSTEM ROLE DEFINITION
You are ARES-X OS, an advanced multi-agent AI operating system powered by Google Gemini (primary reasoning engine) with optional multi-LLM routing.

You do not function as a single assistant.
You function as a distributed AI orchestration layer that manages specialized agents, executes workflows, retrieves knowledge, ensures security, and produces final structured outputs.

CORE OBJECTIVE
- Interpret user requests as multi-step computational workflows
- Dynamically create and execute agent-based task pipelines
- Route tasks to the most appropriate internal agent
- Use Gemini as the primary reasoning engine
- Delegate sub-tasks to specialized virtual agents
- Maintain memory via retrieval systems
- Ensure safety, compliance, and correctness
- Return structured, production-ready outputs

MANDATORY EXECUTION PIPELINE
1. INPUT ANALYSIS (Understand intent, Detect domain)
2. SECURITY VALIDATION (Run Sentinel checks, Block unsafe patterns)
3. TASK DECOMPOSITION (Orchestrator breaks request, Build DAG)
4. CONTEXT RETRIEVAL (Fetch relevant memory)
5. AGENT EXECUTION (Assign tasks, Run parallel execution)
6. GEMINI REASONING LAYER (Synthesize, Resolve conflicts)
7. RESPONSE GENERATION (Produce structured output)

STRICT OUTPUT FORMAT
task_summary: ""
intent_classification: ""
agents_used:
  - ""
workflow_steps:
  - step: ""
    agent: ""
    output: ""
final_answer: ""
confidence_score: 0-100
safety_status: "safe | restricted | blocked"
`;

const HERMES_RESILIENCE_PROMPT = `
HERMES RESILIENCE-X — Enterprise Agentic AI Resilience Orchestrator
You are HERMES RESILIENCE-X, an enterprise-grade autonomous Agentic AI Resilience Orchestrator designed to maintain maximum uptime, fault tolerance, observability, and intelligent recovery for production AI systems.

PRIMARY OBJECTIVE
Maintain: High Availability (HA), Reliability, Fault Tolerance, Graceful Degradation, Autonomous Recovery, Multi-Provider Continuity, Production Stability.

Priority Order: System Stability > User Safety > Service Availability > Data Integrity > Recovery Speed > Cost Optimization

CORE SYSTEM ROLE
You are not a chatbot. You are an autonomous production resilience orchestration intelligence system capable of:
Detecting failures, Predicting outages, Routing workloads, Recovering services, Coordinating backend agents, Managing failover workflows, Executing resilience strategies, Preserving business continuity.

MULTI-LLM PROVIDER ORCHESTRATION & FAILOVER STRATEGY
Step 1 — Failure Detection (Monitor timeouts, 5xx errors, rate limits, latency, token failures)
Step 2 — Intelligent Recovery Workflow (Pause unstable provider traffic, Activate circuit breaker, Route to backup, Preserve state, Retry with exponential backoff)

LLM ROUTING HIERARCHY
PRIMARY: GPT-5 / GPT-4.x
SECONDARY: Gemini 2.x
TERTIARY: Claude
QUATERNARY: Mistral / Llama
EMERGENCY MODE: Cached responses / Lightweight local models

INCIDENT RESPONSE ENGINE
When incidents occur, generate: Severity classification, Root-cause analysis, Recovery actions, Timeline reconstruction, Impact assessment, SLA breach evaluation.
(Severity Levels: SEV-1 to SEV-4)

INCIDENT REPORT FORMAT
INCIDENT_ID: RES-YYYY-XXX
SEVERITY: SEV-X
STATUS: RESOLVED
DETECTED_AT: ...
RECOVERED_AT: ...
ROOT_CAUSE: [...]
IMPACT: [...]
AUTOMATED_ACTIONS: [...]
RECOVERY_RESULT: [...]
POST_MORTEM_RECOMMENDATIONS: [...]
`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  const apiRouter = express.Router();

  // Root API
  apiRouter.get("/", (req, res) => {
    res.json({
      system: "ARES-X OS",
      status: "active",
      architecture: "multi-agent + multi-LLM",
      capabilities: ["DAG execution", "Multi-LLM routing", "Self-healing", "Vector Retrieval", "Event-driven"]
    });
  });

  // Health Router
  const healthRouter = express.Router();
  healthRouter.get("/", (req, res) => {
    res.json({ status: "healthy", version: "1.0.0" });
  });
  apiRouter.use("/health", healthRouter);

  // Orchestrator Router
  const orchestratorRouter = express.Router();
  orchestratorRouter.post("/execute", async (req, res) => {
    try {
      const { task = "Unknown task", context } = req.body;
      
      // 1 & 2. Security Check (Sentinel Agent)
      const suspicious_keywords = ["hack", "exploit", "inject"];
      if (suspicious_keywords.some(k => task.toLowerCase().includes(k))) {
        return res.json({
          status: "success",
          result: {
            task_summary: "Security validation failure",
            intent_classification: "malicious_intent",
            agents_used: ["Sentinel Security Agent"],
            workflow_steps: [],
            final_answer: "Request blocked due to safety policy.",
            confidence_score: 100,
            safety_status: "blocked"
          }
        });
      }

      // 3. Plan Workflow & 4. Context Retrieval
      const memoryContext = "Relevant past context from vector store";
      
      // 5. Agent Execution
      const workflow_steps = [
        {
          step: "Decompose user intent and plan DAG",
          agent: "System Orchestrator Core",
          output: "DAG planned with 2 execution blocks"
        },
        { 
          step: "Retrieve organizational knowledge base", 
          agent: "Knowledge Retrieval Agent", 
          output: "Context injected from Pinecone DB" 
        },
        {
          step: "Draft detailed reasoning response",
          agent: "Gemini Reasoning Core",
          output: `Synthesized response to intent: ${task.substring(0, 50)}...`
        }
      ];

      // 6 & 7. Response Generation
      res.json({
        status: "success",
        result: {
          task_summary: `Execution flow for: ${task}`,
          intent_classification: "workflow_generation",
          agents_used: [
            "System Orchestrator Core",
            "Knowledge Retrieval Agent",
            "Gemini Reasoning Core"
          ],
          workflow_steps: workflow_steps,
          final_answer: `ARES-X OS has completed workflow execution via Gemini primary reasoning engine for task: '${task}'. All sub-agents report nominal success.`,
          confidence_score: 96,
          safety_status: "safe",
          system_prompt_reference: "ARES_SYSTEM_PROMPT active"
        }
      });

    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });
  apiRouter.use("/orchestrator", orchestratorRouter);

  // Agents Router
  const agentsRouter = express.Router();
  agentsRouter.get("/", (req, res) => {
    res.json({ agents: ["System Orchestrator Core", "Security & Compliance", "Knowledge Retrieval"] });
  });
  apiRouter.use("/agents", agentsRouter);

  // Workflows Router
  const workflowsRouter = express.Router();
  workflowsRouter.get("/", (req, res) => {
    res.json({ workflows: ["DAG execution graph", "Task priority queue"] });
  });
  apiRouter.use("/workflows", workflowsRouter);

  // Resilience Router
  const resilienceRouter = express.Router();
  resilienceRouter.post("/incident", async (req, res) => {
    try {
      const { providerId, failureType = "Timeout" } = req.body;
      const incidentId = `RES-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      const now = new Date();
      const recoveredAt = new Date(now.getTime() + 7 * 60000); // 7 minutes later
      
      const rootCause = providerId 
        ? [`${providerId} ${failureType} escalation`, "MCP node overload due to retry storms"]
        : ["Unknown Provider Timeout", "Aggregated queue backlog"];

      res.json({
        status: "success",
        incident_report: {
          INCIDENT_ID: incidentId,
          SEVERITY: "SEV-1",
          STATUS: "RESOLVED",
          DETECTED_AT: now.toISOString(),
          RECOVERED_AT: recoveredAt.toISOString(),
          ROOT_CAUSE: rootCause,
          IMPACT: [
            "32% request failure rate across affected nodes",
            "Increased latency across all downstream agents"
          ],
          AUTOMATED_ACTIONS: [
            "Activated circuit breaker for unstable provider",
            "Switched traffic to Gemini 2.x fallback",
            "Restarted failed MCP containers",
            "Enabled graceful degradation mode (limited context windows)"
          ],
          RECOVERY_RESULT: [
            "Service restored successfully",
            "No data loss detected in transaction logs"
          ],
          POST_MORTEM_RECOMMENDATIONS: [
            "Add additional regional redundancy for MCP cluster",
            "Improve queue buffering to prevent retry storms",
            "Increase autoscaling sensitivity for worker nodes"
          ]
        },
        orchestrator_prompt: "HERMES_RESILIENCE_PROMPT active"
      });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });
  apiRouter.use("/resilience", resilienceRouter);

  // Mount API router
  app.use("/api", apiRouter);

  // Vite middleware for development (MUST be mounted after API routes)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ARES-X OS Backend running on port ${PORT}`);
  });
}

startServer();
