# Portfolio Chatbot Knowledge Base

This folder contains the source knowledge data for Subodh's RAG-based portfolio chatbot. It is only for preparing content that will later be embedded and retrieved by the application. No backend, embedding, retrieval, or API code belongs in this folder during this phase.

## Files

- `knowledge-base.json`: Recruiter-friendly knowledge chunks about Subodh.
- `system-prompt.txt`: The system prompt that will guide the LLM at runtime.
- `README.md`: Notes for maintaining this data folder.

## `knowledge-base.json` Schema

The file is a JSON array. Each item must use this shape:

```json
{
  "id": "unique-slug",
  "category": "about | project | skill | certification | experience | contact",
  "title": "short title",
  "text": "2-5 concise sentences written in third person about Subodh",
  "source": "resume | project-readme | manual"
}
```

Field notes:

- `id`: A stable, unique slug for the chunk.
- `category`: The type of information in the chunk.
- `title`: A short human-readable label.
- `text`: Self-contained content for embedding and retrieval. Keep this under 400 characters.
- `source`: Where the information came from.

## Updating Later

Edit `knowledge-base.json` directly whenever Subodh updates his resume, projects, certifications, or contact details. There is no build step needed for this folder.

When updating chunks:

- Keep each `text` value under 400 characters.
- Write in third person, not as Subodh.
- Make each chunk understandable on its own.
- Replace placeholder project details, certification names, and contact links before going live.
- Add new chunks instead of making existing chunks too broad.
