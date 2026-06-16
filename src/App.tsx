import { Terminal, Copy, Check, Info, AlertTriangle, FileCode, Zap, DollarSign, Tag, Cloud, Activity } from 'lucide-react';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50 text-slate-900 font-sans">
      {/* Top Header */}
      <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">λ</div>
          <h1 className="text-lg font-semibold tracking-tight">
            Serverless Container Architecture <span className="text-slate-400 font-normal">/ AWS Lambda + ECR</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            VPC: 10.76.0.0/16
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200 flex items-center gap-1">
            <Cloud className="w-3 h-3" />
            Terraform Ready
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: File Tree */}
        <aside className="w-64 bg-slate-900 text-slate-300 p-6 flex flex-col flex-shrink-0">
          <h2 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Project Structure</h2>
          <div className="space-y-1.5 font-mono text-sm overflow-y-auto">
            <div className="flex items-center gap-2 py-1"><span className="text-blue-400">📁</span> terraform/</div>
            <div className="flex items-center gap-2 pl-4 py-1"><span className="text-slate-500">📁</span> modules/</div>
            <div className="flex items-center gap-2 pl-8 py-1"><span className="text-yellow-500">📄</span> vpc.tf</div>
            <div className="flex items-center gap-2 pl-8 py-1"><span className="text-yellow-500">📄</span> lambda.tf</div>
            <div className="flex items-center gap-2 pl-8 py-1"><span className="text-yellow-500">📄</span> ecr.tf</div>
            <div className="flex items-center gap-2 pl-4 py-1"><span className="text-yellow-500">📄</span> main.tf</div>
            <div className="flex items-center gap-2 pl-4 py-1"><span className="text-yellow-500">📄</span> variables.tf</div>
            <div className="flex items-center gap-2 py-1"><span className="text-blue-400">📁</span> docker/</div>
            <div className="flex items-center gap-2 pl-4 py-1"><span className="text-white">📄</span> Dockerfile</div>
            <div className="flex items-center gap-2 pl-4 py-1"><span className="text-white">📄</span> app.py</div>
            <div className="flex items-center gap-2 py-1 font-bold text-white italic underline"><span className="text-green-400">📄</span> README.md</div>
          </div>
          
          <div className="mt-auto pt-6">
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-tighter">Resource Tags</p>
              <div className="grid grid-cols-1 gap-2 text-[11px]">
                <div className="flex justify-between items-center"><span className="text-slate-300">Environment:</span><span className="text-blue-400 font-medium">Production</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-300">Service:</span><span className="text-blue-400 font-medium">lambda-api</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-300">CreatedBy:</span><span className="text-blue-400 font-medium">Terraform</span></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-50/50">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Guide & Code Snippets */}
            <div className="flex flex-col gap-6">
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>Deployment Workflow
                </h3>
                <ol className="space-y-5">
                  <li className="flex gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">1</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Containerize API</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">Build multi-arch image using Dockerfile.</p>
                    </div>
                  </li>
                  <li className="flex gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">2</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">ECR Provisioning</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">Terraform pushes image to private repository.</p>
                    </div>
                  </li>
                  <li className="flex gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">3</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Lambda Configuration</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">Deploy image with VPC peering and IAM roles.</p>
                    </div>
                  </li>
                </ol>
              </section>

              <section className="bg-slate-900 rounded-xl p-6 text-slate-100 font-mono text-[12px] shadow-lg border border-slate-800">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                  <p className="text-slate-400 flex items-center gap-2"><FileCode className="w-4 h-4" /> terraform/modules/lambda.tf</p>
                  <button className="text-slate-500 hover:text-white transition-colors"><Copy className="w-4 h-4" /></button>
                </div>
                <pre className="leading-relaxed overflow-x-auto text-blue-200">
  <span className="text-purple-400">resource</span> <span className="text-green-300">"aws_lambda_function"</span> <span className="text-blue-300">"api"</span> {'{\n'}
    <span className="text-slate-300">function_name</span> = <span className="text-green-300">"lambda-docker-api"</span>
    <span className="text-slate-300">package_type</span>  = <span className="text-green-300">"Image"</span>
    <span className="text-slate-300">image_uri</span>     = <span className="text-green-300">{"\"${aws_ecr_repository.repo.url}:latest\""}</span>
    <span className="text-slate-300">role</span>          = aws_iam_role.lambda_exec.arn
    <span className="text-slate-300">vpc_config</span> {'{\n'}
      <span className="text-slate-300">subnet_ids</span>         = aws_subnet.private[*].id
      <span className="text-slate-300">security_group_ids</span> = [aws_security_group.lambda.id]
    {'}'}
    <span className="text-slate-300">tags</span> = var.lambda_tags
  {'}'}
                </pre>
              </section>
            </div>

            {/* Right Column: Observability & DR */}
            <div className="flex flex-col gap-6">
              {/* Monitoring Card */}
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-500" />
                    Monitoring & Latency
                  </h3>
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 border border-red-200 rounded-md text-[10px] font-bold flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-3 h-3" />
                    CRITICAL ALERT
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                    <div className="flex justify-between text-xs mb-3">
                      <span className="font-semibold text-slate-700">p99 Latency Trend</span>
                      <span className="text-red-600 font-bold uppercase tracking-wider text-[10px]">Alert &gt; 500ms</span>
                    </div>
                    <div className="h-20 w-full flex items-end gap-1.5 pt-2">
                      <div className="flex-1 bg-blue-200 h-[20%] rounded-t-sm hover:bg-blue-300 transition-colors"></div>
                      <div className="flex-1 bg-blue-300 h-[30%] rounded-t-sm hover:bg-blue-400 transition-colors"></div>
                      <div className="flex-1 bg-blue-400 h-[45%] rounded-t-sm hover:bg-blue-500 transition-colors"></div>
                      <div className="flex-1 bg-blue-500 h-[35%] rounded-t-sm hover:bg-blue-600 transition-colors"></div>
                      <div className="flex-1 bg-red-400 h-[70%] rounded-t-sm hover:bg-red-500 transition-colors"></div>
                      <div className="flex-1 bg-red-500 h-[85%] rounded-t-sm hover:bg-red-600 transition-colors"></div>
                      <div className="flex-1 bg-red-600 h-[100%] rounded-t-sm hover:bg-red-700 transition-colors"></div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 italic flex items-center gap-1.5">
                    <Info className="w-3 h-3 flex-shrink-0" />
                    CloudWatch Alarms active for Duration, Error Rate, and Throttles.
                  </p>
                </div>
              </section>

              {/* Multi-Region DR Card */}
              <section className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-xl p-6 text-white overflow-hidden relative shadow-lg">
                <div className="relative z-10">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-2 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5" />
                    Global Disaster Recovery
                  </h3>
                  <p className="text-lg font-light mb-6 text-blue-50">Active-Passive Failover via Route 53</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
                        <p className="text-[10px] uppercase font-semibold text-blue-200 tracking-wider">Primary</p>
                      </div>
                      <p className="text-sm font-bold mt-1">us-east-1</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                        <p className="text-[10px] uppercase font-semibold text-blue-200/70 tracking-wider">Secondary</p>
                      </div>
                      <p className="text-sm font-bold text-slate-300 mt-1">us-west-2</p>
                    </div>
                  </div>
                </div>
                {/* Decorative background glow */}
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[60px] pointer-events-none"></div>
                <div className="absolute -left-10 -top-10 w-40 h-40 bg-purple-500/10 rounded-full blur-[40px] pointer-events-none"></div>
              </section>

              {/* Cost Aspect Card */}
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex-1 hover:shadow-md transition-shadow">
                <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2 uppercase tracking-wide">
                  <DollarSign className="w-4 h-4 text-slate-500" />
                  Monthly Run Rate
                </h3>
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                    <span className="text-slate-600">Lambda Compute (1M req)</span>
                    <span className="font-mono text-slate-800 font-medium">$18.40</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                    <span className="text-slate-600">ECR Storage & Transfer</span>
                    <span className="font-mono text-slate-800 font-medium">$0.50</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pb-2">
                    <span className="text-slate-600">VPC Interface Endpoints</span>
                    <span className="font-mono text-slate-800 font-medium">$22.50</span>
                  </div>
                  <div className="border-t-2 border-slate-100 pt-4 mt-2 flex justify-between items-center font-bold">
                    <span className="text-slate-800 uppercase tracking-wide text-xs">Total Estimated Cost</span>
                    <span className="text-blue-600 text-xl font-mono">$41.40<span className="text-xs text-slate-400 font-sans ml-1">/mo</span></span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Footer Bar */}
      <footer className="h-12 bg-slate-50 border-t border-slate-200 px-8 flex items-center justify-between text-[11px] font-medium text-slate-500 z-10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5" />
          <span>PROJECT: <span className="font-bold text-slate-700">LAMBDA-CONTAINER-IAC</span></span>
        </div>
        <div className="flex gap-8 uppercase tracking-wider">
          <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Version: 1.0.4</span>
          <span className="flex items-center gap-1.5"><Cloud className="w-3.5 h-3.5" /> Region: Global</span>
          <span className="flex items-center gap-1.5 text-green-600"><Check className="w-3.5 h-3.5" /> Validated</span>
        </div>
      </footer>
    </div>
  );
}
