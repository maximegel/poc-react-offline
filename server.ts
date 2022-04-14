import cors from "cors";
import express from "express";
import delay from "express-delay";

const data: Record<string, Record<string, Record<string, unknown>>> = {
  inventoryItems: {
    "45fa304b-302f-438d-99ee-8ab286c9b638": {
      id: "45fa304b-302f-438d-99ee-8ab286c9b638",
      model: "Salomon X Ultra 3",
      category: "Shoes",
    },
    "bea804d7-ff11-4c4f-b374-eb89b59fa8c6": {
      id: "bea804d7-ff11-4c4f-b374-eb89b59fa8c6",
      model: "Merrell Moab 2",
      category: "Shoes",
    },
    "a7b6a45d-8d0b-4dce-84f5-1d7d01905da0": {
      id: "a7b6a45d-8d0b-4dce-84f5-1d7d01905da0",
      model: "Hoka One One Speedgoat 4",
      category: "Shoes",
    },
  },
};

const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());
app.use(delay(1000));

app.get("/:resource", (req, res) => {
  const { resource } = req.params;
  res.json(data[resource]);
});

app.put("/:resource/:id", (req, res) => {
  const { resource, id } = req.params;
  const collection = data[resource];
  const existing = collection[id];
  if (existing) {
    collection[id] = { ...existing, ...req.body };
    return res.sendStatus(204);
  }
  collection[id] = req.body;
  return res.sendStatus(201);
});

app.delete("/:resource/:id", (req, res) => {
  const { resource, id } = req.params;
  const collection = data[resource];
  delete collection[id];
  return res.sendStatus(204);
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
