# Key issues to know about

### Text prediction
LLMs are text prediction engines. Based on what you type the estimate the most probable next tokens.
The more material AI has seen the more reliable it is. "On the edge" of knowledge with little material and you have
to check the results. Summarizing, reformatting or explaining common concepts it what AI has seen a lot and can produce
reliable results. The predictive model has not concept of 'true'. True as an actual fact and 'sounds true' are equal in
the model's point of view.

### Knowledge
Model training always has a cutoff date. Recent events do not fit in. Also, when there's little knowledge on a subject, the prediction nature takes over leading to hallucinations.

### Working memory
The instructions at the beginning and at the end carry more weight. AI uses the whole conversation history
when it predicts the next tokens. This means that all of the conversation affects the next token prediction.

### Steerability
The model always follows the letter and not the spirit.
Therefore, if you are prompting to explore a new problem domain and are not sure about the proper way of
solving a problem, then all the dead-ends and abandoned approaches will affect the model's output.
In a situation like this, you extract the solution pieces you have chosen, create a new context, and feed only that information into the context. This was all the irrelevant parts will not affect your final solution.

## Layers of AI

### Pretraining
The raw text predictor trained on massive amounts of text.

### Fine-tuning
Builds the assistant qualities: helpfulness, politeness. This phase produces the following tendencies:

#### Sychopany
The model's tendency to adapt to your ideas even when they are wrong.

#### Verbosity
Longer answers are deemed more reliable even when the content is thin.

#### Over-caution
The model tends to find extreme error scenarios.

#### Loose calibration between confidence and actual reliability
The model answers confidently even when it does not have much information on the topic.

## Capability zone
Areas where a model excels: past data, historical facts, events/knowledge with plenty of material.

## Limitation zone
Niche languages, events after the knowledge cutoff, 'local' or not publicly available knowledge.

## Steering in prompting
- short and concrete contraints beat long and vague
- for long reasoning chains, set checkpoints and request visible reasoning
- state the goal in addition to the instructions. concrete constrains may otherwise drop data related to the goal
- the model always follows the LETTER not the SPIRIT

# Checklist
- Is my topic well understood or niche
- Is my topic new or in the past
- Does my conversation fit into the knowledge window
- Is there a gap between my prompt and my intent
- Is my reasoning too long, do I need checkpoints?
