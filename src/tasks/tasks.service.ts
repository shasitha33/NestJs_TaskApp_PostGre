import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';  /* changed Q&A   */
import { CreateTaskDto } from './dto/create-task.dto';
/*import { Task } from '../../dist/tasks/task.model';*/
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { STATUS_CODES } from 'http';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ){}

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>{
        return this.taskRepository.getTasks(filterDto);
    }
    
    async getTaskById(id: number): Promise<Task>{
        const found = await this.taskRepository.findOne(id);

        if (!found){
            throw new NotFoundException(`Task with ID "${id}" not found`); /*Not Single Quetes*/
        }
        return found;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> { 
        return this.taskRepository.createTask(createTaskDto);
    }

    async deleteTask(id: number): Promise<void>{
        const result = await this.taskRepository.delete(id);
        
        if (result.affected === 0){
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }

    // updateTaskStatus(id: string, status: TaskStatus): Task{
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;
    // }
}
