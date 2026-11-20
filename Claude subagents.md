Claude spawns subagents from the main agent. These subagents get a new, fresh context window, plus the system prompt of the subagent definition, and finally a _task prompt_ written by the main agent.

The main purpose is to off-load the main agent's context window. Used when the sub-agent needs to perform work and only return a result to the main agent's context.

A subagent has a _name_ whose purpose is to enumerate the agent amongst all the subagents.
It also has a _description_ which is for the main agent. If you need to describe to the main agent how to formulate the task prompt, this information goes in here.

Finally, the subagent definition's body is the system prompt for the subagent itself.

Sometimes you might have long-running workflow descriptions in a skill. It may be tempting to put these as subagents instead. However, there's no harm in having these as skills as claude is capable of running these in the background if needed. The deciding factor is whether the subagent processed data that the main agent needs to be aware of.

Another deciding factor is that the subagent's system prompt is fundamentally different than claude's main prompt. The main prompt is targeted towards coding work, and some other `personas` can be more effectively served by a subagent.