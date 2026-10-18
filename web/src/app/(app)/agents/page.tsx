"use client";

import { useState } from "react";
import {
  Bot,
  Cpu,
  Layers,
  Network,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Activity,
  Code2,
  Sliders,
  Play,
  ArrowRight,
  Server,
  Zap,
} from "lucide-react";

import { PageHeader } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/lib/copy";
import { AGENT_CONFIGS, type AgentId } from "@/lib/agents-data";

export default function AgentsPage() {
  const { copy } = useLanguage();
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId>("keuangan");
  const [activeTab, setActiveTab] = useState<string>("overview");

  const currentAgent = AGENT_CONFIGS[selectedAgentId];

  const agentIcons: Record<AgentId, React.ReactNode> = {
    keuangan: <Bot className="size-4 text-emerald-600 dark:text-emerald-400" />,
    fiskal: <Cpu className="size-4 text-blue-600 dark:text-blue-400" />,
    regulasi: <Layers className="size-4 text-purple-600 dark:text-purple-400" />,
    orchestrator: <Network className="size-4 text-amber-600 dark:text-amber-400" />,
  };

  return (
    <>
      <PageHeader
        title={copy.nav.agents}
        subtitle="Autonomous Multi-Agent Orchestration & Inspection Console"
        badge="ADK Multi-Inference"
      />

      {/* Main Split-Pane Container with Internal Sidebar */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Internal Sub-Sidebar (Left Master Pane) */}
        <aside className="w-full md:w-72 shrink-0 space-y-4">
          <div className="rounded-lg border border-border/70 bg-card p-3 shadow-none">
            <div className="flex items-center justify-between pb-2 border-b border-border/50 px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Agents
              </span>
              <Badge variant="outline" className="text-[10px] font-mono h-5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                4 Registered
              </Badge>
            </div>

            <nav className="mt-2 space-y-1.5" aria-label="Agents list">
              {(Object.keys(AGENT_CONFIGS) as AgentId[]).map((id) => {
                const agent = AGENT_CONFIGS[id];
                const isSelected = selectedAgentId === id;

                return (
                  <button
                    key={id}
                    onClick={() => setSelectedAgentId(id)}
                    className={`w-full text-left rounded-md px-3 py-2.5 transition-colors flex items-center justify-between gap-3 text-sm ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-medium shadow-none"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`grid size-7 shrink-0 place-items-center rounded-md ${
                        isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted"
                      }`}>
                        {agentIcons[id]}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold leading-tight">
                          {id === "keuangan"
                            ? copy.agents.keuangan
                            : id === "fiskal"
                            ? copy.agents.fiskal
                            : id === "regulasi"
                            ? copy.agents.regulasi
                            : "Orchestrator"}
                        </p>
                        <p className={`text-[10px] truncate ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {agent.category}
                        </p>
                      </div>
                    </div>
                    <span className={`size-1.5 rounded-full shrink-0 ${
                      agent.status === "active"
                        ? isSelected
                          ? "bg-primary-foreground"
                          : "bg-emerald-500"
                        : "bg-muted-foreground"
                    }`} />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Infrastructure Health Indicator */}
          <Card className="border-border/70 shadow-none bg-muted/30">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                <Server className="size-3.5 text-muted-foreground" />
                Inference Gateway
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-1.5 text-[11px] text-muted-foreground">
              <div className="flex justify-between">
                <span>Model Engine</span>
                <span className="font-mono text-foreground font-medium">Gemini 3.8 Flash</span>
              </div>
              <div className="flex justify-between">
                <span>Framework</span>
                <span className="font-mono text-foreground font-medium">Google ADK 2.x</span>
              </div>
              <div className="flex justify-between">
                <span>Deployment</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">Cloud Run Ready</span>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Right Detail Canvas Pane */}
        <main className="flex-1 min-w-0 w-full space-y-6">
          {/* Agent Header Card */}
          <div className="rounded-lg border border-border/70 bg-card p-5 shadow-none space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  {agentIcons[currentAgent.id]}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold tracking-tight">{currentAgent.title}</h2>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {currentAgent.version}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {currentAgent.category} · {currentAgent.framework}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">
                  Operational
                </Badge>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/50">
              {currentAgent.description}
            </p>
          </div>

          {/* Tab Navigation for Detailed Sections */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-muted/60 p-1 border border-border/60">
              <TabsTrigger value="overview" className="text-xs gap-1.5">
                <Sliders className="size-3.5" />
                Overview & Guardrails
              </TabsTrigger>
              <TabsTrigger value="tools" className="text-xs gap-1.5">
                <Code2 className="size-3.5" />
                Tools & Capabilities ({currentAgent.tools.length})
              </TabsTrigger>
              <TabsTrigger value="sandbox" className="text-xs gap-1.5">
                <Terminal className="size-3.5" />
                Test Sandbox
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: OVERVIEW */}
            <TabsContent value="overview" className="space-y-5 pt-2">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {currentAgent.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-lg border border-border/60 bg-card p-3 shadow-none space-y-1"
                  >
                    <p className="text-[11px] text-muted-foreground">{metric.label}</p>
                    <p className="text-sm font-semibold tracking-tight font-mono">{metric.value}</p>
                  </div>
                ))}
              </div>

              {/* Guardrails Mandate Card */}
              <Card className="border-border/70 shadow-none">
                <CardHeader className="py-4 px-5">
                  <div className="flex items-center gap-2 text-foreground">
                    <ShieldCheck className="size-4 text-primary" />
                    <CardTitle className="text-sm font-semibold">Statutory & Architectural Guardrail</CardTitle>
                  </div>
                  <CardDescription className="text-xs mt-1">
                    Deterministic policy enforced before state mutation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-4 pt-0">
                  <div className="rounded-md bg-muted/40 p-3 text-xs leading-relaxed font-mono border border-border/40">
                    {currentAgent.mandate}
                  </div>
                </CardContent>
              </Card>

              {/* Runtime Configuration Card */}
              <Card className="border-border/70 shadow-none">
                <CardHeader className="py-4 px-5">
                  <CardTitle className="text-sm font-semibold">Runtime Parameters</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded border border-border/40 bg-muted/20">
                      <span className="text-muted-foreground block text-[11px]">Inference Model ID</span>
                      <span className="font-mono font-medium">{currentAgent.model}</span>
                    </div>
                    <div className="p-2.5 rounded border border-border/40 bg-muted/20">
                      <span className="text-muted-foreground block text-[11px]">Primary Endpoint</span>
                      <span className="font-mono font-medium">{currentAgent.endpoint}</span>
                    </div>
                    <div className="p-2.5 rounded border border-border/40 bg-muted/20">
                      <span className="text-muted-foreground block text-[11px]">Retry Policy</span>
                      <span className="font-mono font-medium">HttpRetryOptions (4 attempts, exponential)</span>
                    </div>
                    <div className="p-2.5 rounded border border-border/40 bg-muted/20">
                      <span className="text-muted-foreground block text-[11px]">State Machine</span>
                      <span className="font-mono font-medium">Sequential Non-Blocking Cascade</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: TOOLS & CAPABILITIES */}
            <TabsContent value="tools" className="space-y-4 pt-2">
              {currentAgent.tools.map((tool) => (
                <Card key={tool.name} className="border-border/70 shadow-none">
                  <CardHeader className="py-3.5 px-5">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-sm font-mono text-primary font-semibold">
                        {tool.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        Deterministic Tool
                      </Badge>
                    </div>
                    <p className="text-xs font-mono bg-muted/50 p-2 rounded border border-border/40 text-foreground mt-2">
                      {tool.signature}
                    </p>
                  </CardHeader>
                  <CardContent className="px-5 pb-4 pt-0 space-y-2 text-xs">
                    <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
                    <div className="flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                      <CheckCircle2 className="size-3.5 shrink-0 mt-0.5" />
                      <span><strong>Guardrail:</strong> {tool.guardrail}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* TAB 3: TEST SANDBOX */}
            <TabsContent value="sandbox" className="space-y-4 pt-2">
              <Card className="border-border/70 shadow-none">
                <CardHeader className="py-4 px-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold">Interactive Dry-Run Simulator</CardTitle>
                      <CardDescription className="text-xs">
                        Simulate synthetic transaction payload against this agent's validation engine.
                      </CardDescription>
                    </div>
                    <Button size="sm" variant="default" className="text-xs gap-1.5 h-8">
                      <Play className="size-3" />
                      Run Simulation
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4 pt-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <Terminal className="size-3.5" /> Sample Request Payload
                      </span>
                      <pre className="p-3 rounded-lg bg-stone-900 text-stone-100 dark:bg-stone-950 font-mono text-[11px] overflow-x-auto border border-stone-800">
                        {currentAgent.samplePayload}
                      </pre>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <Activity className="size-3.5" /> Synthesized Agent Output
                      </span>
                      <pre className="p-3 rounded-lg bg-stone-900 text-stone-100 dark:bg-stone-950 font-mono text-[11px] overflow-x-auto border border-stone-800">
                        {currentAgent.sampleOutput}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
