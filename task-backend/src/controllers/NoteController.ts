import { Request,Response } from "express";
import Note ,{INote}from "../models/Note";
import { Types } from "mongoose";
type NoteParams={
    noteId:Types.ObjectId
}
export class NoteController{
    static  createNote = async(req:Request<{},{},INote>,res:Response)=>{
        const {content} = req.body
        //create the note
        const note = new Note()
        note.content = content
        note.createdBy= req.user.id
        note.task = req.task.id

        //we put the note in the task
        req.task.notes.push(note.id)
        try {
            await Promise.allSettled([req.task.save(),note.save()])
            res.send('Note created successfull')
        } catch (error) {
            res.status(500).json({error:'there was on error'})
        }
    }

    static  getTaskNotas = async(req:Request,res:Response)=>{
        try {
            const notes = await Note.find({task:req.task.id})
            res.json(notes)
        } catch (error) {
            
        }
    }

    static  deleteNote = async(req:Request<NoteParams>,res:Response)=>{
        const {noteId} = req.params
        const note = await Note.findById(noteId)

        if(!note){
            const error = new Error('Note not found')
            return res.status(404).json({error:error.message})
        }
        //the user is in session is who created the note
        if(note.createdBy.toString() !== req.user.id.toString()){
            const error = new Error('Action not validate')
            return res.status(401).json({error:error.message})
        }

        //delete note of a task
        req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString())
        try {
            await Promise.allSettled([req.task.save(),note.deleteOne()])
            res.send('Note deleted')
            
        } catch (error) {
            res.status(500).json({error:'there was on error'})

        }


    }
}