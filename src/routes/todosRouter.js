import express from 'express';
import Todo from '../models/Todos.js';
import passport from 'passport';
const router = express.Router();

// 로그인한 유저의 todolist crud 구현
router.get('/', async (req, res) => {
    console.log(req.user)
    try {
        const userId = req.user._id;
        const todos = await Todo.find({ userId });
        if (todos.length === 0) {
            return res.status(404).send('Todos not found for the user');
        }
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).send('Failed to fetch todos');
    }
});

router.post('/', async (req, res) => {
    const { title, description, userId } = req.body;
    try {
        const newTodo = await Todo.create({
            title,
            description,
            userId : req.user._id
        });
        await newTodo.save()
        return res.status(201).json(newTodo);
    } catch (error) {
        console.error('Error creating todo:', error);
        return res.status(500).send('Failed to create todo')
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params; // URL 파라미터에서 Todo의 _id 가져오기
    const { title, description, completed } = req.body; // 요청 바디에서 새로운 title, description, completed 가져오기

    try {
        // MongoDB를 사용하여 Todo 업데이트
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: id }, // _id 필드를 URL 파라미터에서 가져온 id로 설정
            { title, description, completed }, // 업데이트할 필드
            { new: true } // 옵션: 업데이트 후의 문서 반환
        );

        if (!updatedTodo) {
            console.log(`Todo with id ${id} not found`);
            return res.status(404).send('Todo not found');
        }

        console.log(`Todo updated successfully: ${updatedTodo}`);
        return res.status(200).json(updatedTodo); // 업데이트된 Todo 반환
    } catch (error) {
        console.error('Error updating todo:', error);
        return res.status(500).send('Failed to update todo');
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedtodo = await Todo.deleteOne({ _id : id })
        if (!deletedtodo) {
          return res.status(404).json({ message: 'Todo not found' });
        }
        console.log(deletedtodo)
        return res.status(200).json(deletedtodo);
        } catch (error) {
        return res.status(500).send('Failed to delete todo');
    }
})

export default router;

