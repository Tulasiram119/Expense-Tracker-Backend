const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
//Route 1: get all notes for the user login required using get method endpoint /apinotes/fetchallnotes
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occurred");
  }
});
//Route 2: Add  notes for the user login required  using post method endpoint /api/notes/addnote
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body(
      "description",
      "Length of the description is too small, it must be atleast 5 charaters"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // is there are erros return bad request and errors
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).send(result.array());
      }
      const note = new Notes({ title, description, tag, user: req.user.id });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occurred");
    }
  }
);
//Route 3: Update an existing a node using /api/notes/updatenote/ put method login required
router.put(
    "/updatenote/:id",
    fetchUser,    
    async (req, res) => {
      try {
        const { title, description, tag } = req.body;       
        //create new note object
        const newNote = {};
        if(title){newNote.title = title}
        if(description){newNote.description = description}
        if(tag){newNote.tag = tag}
        //find the note to be updated
        let note = await Notes.findById(req.params.id);
        //if note didn't found
        if(!note){
            return res.status(404).send("Not found");
        }
        // to see the user editing the his note or someone's else note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not allowed")
        }
        note = await Notes.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true})
        res.json(note);

      } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occurred");
      }
    }
  );
  //Route 4: Delete an existing a node using /api/notes/deletenote/ delete method login required
  router.delete(
    "/deletenote/:id",
    fetchUser,    
    async (req, res) => {
      try {
        const { title, description, tag } = req.body;      
        //find the note to be deleted
        let note = await Notes.findById(req.params.id);
        //if note didn't found
        if(!note){
            return res.status(404).send("Not found");
        }
        // to see the user deleting his note or someone's else note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not allowed")
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({"Sucess":"note has bee deleted",note:note});

      } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occurred");
      }
    }
  );
module.exports = router;
