import express from "express"
import Task from "../models/Task.js"

const router=express.Router();

router.get("/seed", async (req, res) => {
  try {
    const testTasks = [
      { text: "Learn React", completed: false },
      { text: "Build Todo App", completed: true }
    ];
    
    const createdTasks = await Task.insertMany(testTasks);
    res.json({ 
      message: "Test data created!", 
      tasks: createdTasks 
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});
//Route handling getting all tasks
router.get("/",async(req,res)=>{
try {
    const tasks=await Task.find();
    res.json(tasks)
} catch (error) {
    res.status(500).json({message:error.message});
}
});

//Route handling creating new tasks
router.post("/",async(req,res)=>{
    const tasks=new Task({
        text:req.body.text
    });
    try {
        const newTasks=await tasks.save();
        res.status(201).json(newTasks)
    } catch (error) {
        res.status(400).json({message:error.message})
    }
});

//Router handling updating tasks
router.patch("/:id",async(req,res)=>{
try {
    const tasks=await Task.findById(req.params.id);
    if(!tasks) return res.status(400).json({message: "Task not found"});
    if(req.body.text !==undefined){
        tasks.text=req.body.text;
    }
    if(req.body.completed!==undefined){
        tasks.completed=req.body.completed;
    }
    const updatedTasks=await tasks.save();
    res.json(updatedTasks)
} catch (error) {
    res.status(400).json({message:error.message});
}
})

//Router handling deleting tasks
router.delete("/:id",async(req,res)=>{
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({message:"Task deleted"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});

export default router;