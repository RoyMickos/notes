## Week 4 excercise
- force the model to call your tool that returns data. Define an output schema for LLm to extract key points from the data, Then feed test documents to llm and observe what it returns, especially in cases where your input has missing datapieces.
- Now, someting fun for data, what could that be? Bikes, trains, ntsb reports...

A multi-agent research system uses a coordinator that dispatches tasks to three specialized subagents: a web researcher, a database analyst, and a summarizer. The team discovers that the summarizer subagent is producing summaries that reference data it was never given, seemingly drawing from the web researcher's findings. What is the MOST likely cause of this behavior?

Subagents share a rolling summary of one another's outputs by default through the framework's shared memory, leaking context between roles

The coordinator is inadvertently including the web researcher's results in the context when dispatching tasks to the summarizer

Correct answer

Explanation: Correct. This is the most likely cause.

The summarizer's tokenizer pulls phrases from the web researcher's earlier indexed output, producing implicit knowledge transfer at decode

The summarizer relies on prompt caching across subagent calls, and a cache hit replays earlier outputs into the request

Your answer

Explanation: Prompt caching only reuses the prefix of a single API call to reduce input cost; it does not splice content from other subagents into the request. A cache hit returns the same model output for the same prefix, not snippets from a different subagent's run.

✗ Incorrect

Explanation

This is the most likely cause. In a hub-and-spoke multi-agent architecture, the coordinator manages all communication between subagents. Subagents have isolated contexts and do NOT automatically inherit information from other subagents. However, a common implementation mistake is for the coordinator to accumulate all subagent results in its own conversation history and then forward the entire context when dispatching the next task. If the coordinator's prompt to the summarizer includes the web researcher's raw output (either intentionally for context or accidentally as part of the conversation history), the summarizer will reference that data in its summary. The fix is to carefully control exactly what context the coordinator passes to each subagent, ensuring the summarizer only receives the specific inputs it needs for its task.

----
13

A developer is designing a customer support agent that handles returns, refunds, and order modifications. The agent has access to 22 tools including: lookup_order, check_inventory, process_return, issue_refund, modify_order, check_shipping_status, escalate_to_human, send_email, update_crm, log_interaction, check_loyalty_points, apply_discount, verify_identity, check_fraud_score, update_address, cancel_order, reorder_item, check_warranty, process_exchange, generate_label, schedule_pickup, and track_package. During testing, Claude frequently selects the wrong tool or calls tools in incorrect sequences. What is the primary architectural improvement to address this?

Sharpen each tool description with detailed input formats, expected outputs, and explicit boundary conditions to help Claude route correctly

Add few-shot examples in the system prompt that walk through the correct tool sequence for every common customer-support request type

Switch to using tool_choice with a named tool at every turn so the orchestrator hardcodes which of the 22 tools fires per step

Your answer

Explanation: Forcing tools via named tool_choice at every step is a real API capability and would deterministically remove ambiguity. The cost is that the orchestrator must already know the correct sequence per request, which collapses the agent into a hardcoded script. That defeats the purpose of using Claude for the routing in the first place.

Consolidate related tools into workflow-level tools and use a routing layer to present only 4-5 relevant tools per conversation phase

Correct answer

Explanation: Correct. This directly addresses the root cause.

✗ Incorrect

Explanation

This directly addresses the root cause. Research shows that 4-5 tools is the optimal range for reliable tool selection, and performance degrades significantly when models must choose among 18+ tools. The solution has two parts: first, consolidate related tools into higher-level workflow tools (e.g., combine process_return, generate_label, and schedule_pickup into a single handle_return_workflow tool). Second, implement a routing layer that dynamically presents only the tools relevant to the current conversation phase. For example, during identity verification, only show verify_identity and check_fraud_score. After verification, swap to the action tools. This keeps the decision space manageable while preserving all functionality.

----
You are building a customer support resolution agent that handles billing inquiries. The agent uses tool calls to look up account details and process refunds. During testing, you notice the agent sometimes stops mid-conversation without completing the resolution. What is the MOST likely cause of this behavior?

The agentic loop terminates on stop_reason='end_turn' instead of continuing only when stop_reason='tool_use'

Correct answer

Explanation: Correct. In a properly implemented agentic loop, the agent should continue processing when the API response returns stop_reason='tool_use', indicating the model wants to call a tool.

The agent's max_tokens budget is set too low, so the model truncates mid tool_use block before the orchestrator can

Your answer

Explanation: max_tokens does limit response length, but a truncated tool_use block surfaces as stop_reason='max_tokens' that the orchestrator can detect, not a silent mid-conversation halt. The Messages API still returns whatever partial content was produced and the loop decides what happens next. The actual cause is in how the loop interprets stop_reason='tool_use' versus 'end_turn'.

tool_use blocks are parsed before stop_reason is checked, so malformed tool_input JSON is treated as the model's

Prompt caching invalidates between turns, so the system prompt is re-evaluated and the agent loses track

✗ Incorrect

Explanation

This is the correct answer. In a properly implemented agentic loop, the agent should continue processing when the API response returns stop_reason='tool_use', indicating the model wants to call a tool. The loop should only terminate when stop_reason='end_turn', meaning the model has decided it has completed its task and is ready to present a final response to the user. If the loop logic is inverted or does not properly check for stop_reason='tool_use' as the continuation signal, the agent will stop prematurely whenever the model attempts a tool call instead of executing it and feeding the result back. This is one of the most fundamental patterns in agentic architecture: the loop continues as long as the model requests tool use and terminates when the model signals it is done with an end_turn.
