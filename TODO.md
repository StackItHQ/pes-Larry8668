# Thought process, architecture, plan of action 💡

## Architecture in mind

![High level design](./diagrams/HLD.png)
---

- **Google Sheets**
    - Essentially where clients will be doing stuff
    - Need to capture changes made in the sheets and then send out as events to backend
    - Need to look into Google Sheets APIs

- **Google Apps Script**
    - May come in handy for taking care of detecting changes in sheets and then hitting the backend (yet to try)
    - Will also take care of modifying sheets as and when req programatically
    - Need to look into further.

- **Express Server**
    - Where all the magic happens and interface to our DB (Supabase as of now)
    - Gets changes that are made to the sheets, and stores in the DB
    - Also provides data from the DB for the frontend
    - Probably host it on Render

- **Supabase** 
    - Provides hosted PostgreSQL so maybe comes in handy (may change)
    - Will need to take care of schema of data saved
    - Also wil need to make schema to keep note of changes made (something like git logs - may be a far shot)

- **Frontend**
    - Frontend to see all the spreadsheets linked as well as commit history for each sheet
    - basically git logs - so read only 
    - Not essential but good to have?
    - Host it on vercel

---