An IT services company with distributed teams faces 
# challenges: 
managing task allocation, 
sprint tracking, 
and performance visibility across multiple projects. 

# Currently, teams rely on 
spreadsheets, 
emails, 
and third-party tools, 

# Issues: 
## Poor visibility of task progress 
//* we have to ping the worker for a status report

r: requirement
n: nice to have
i: ideal

r * Explicit work-in-progress limits per column(Forces completion before starting new work.)
r * data for analytics: use binary/low-noise indicators like task transitions, done-events, etc.

## Difficulty in sprint planning 
r * setting sprint-goal in outcome terms
n * evaluate each task against sprint-goal before entry into backlog-list(for each new task, provide reasoning of alignment with sprint goal; definition of ready)
n * Backlog tasks must be refinable (editable) 
n * flag high uncertainty tasks
n * Definiton of Done (before moving task to done list, provide reasoning of it's compliance with the DoD)

## No unified performance analytics 
r * essentially, we're trying to answer: “Are we closer to the sprint goal today than yesterday?”
i * burn-down/up charts
r * layout: top:Sprint goal status + delivery summary; middle: cycle-time(start-->done), throughput(items completed per sprint), Cumulative Flow Diagram (https://res.cloudinary.com/brainbok/image/upload/v1719129649/cumulative-flow-diagram-agile.png) 
n * flow efficiency

## Limited accountability and traceability 
* addressed this issue with worker-id on each task

# A good Implementation:
Makes work visible, not people vulnerable
Tracks flow, not effort
Encourages completion over starting
Enables early intervention, not post-mortems

there will be a project-id and the member-id will request approval to work on the project
how does the initial steps for a user look like?
they log in
enter the dashboard
they see a list of sprints with their statuses(active, paused, finished)

# Tasks in the kanban board
* Each task will have associated member-ids working on it; only associated members will be able to move the task within the board

worker-id(s)
creator-id
description
why-this-task
creation-time
time-of-movement-into-WIP
time-of-movement-into-done

# Ashik
* remove admin role from registration page; admins will be added from teh commandline after we hand over the backend
* add user-administration tab on the left(managing users, approving requests, etc); this tab is only visible to admin


## bugs:
* create new project: end date may be before startdate
* analytics: pi-charts: overlapping section titles
* 