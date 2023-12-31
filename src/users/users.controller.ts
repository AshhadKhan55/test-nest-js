import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(
        private usersService: UsersService,
        private authService: AuthService
        ) {}

    @Post("/signup")
    async createUser(@Body() body:CreateUserDto, @Session() session:any){
        const user = await this.authService.signup(body.email,body.password)
        session.userId = user.id;
        return user;
    }

    @Post("/signin")
    async signin(@Body() body: CreateUserDto, @Session() session:any){
        const user = await this.authService.signin(body.email,body.password)
        session.userId = user.id
        return user;
    }

    @Get("/:id")
    @UseGuards(AuthGuard)
    findUser(@Param("id") id:string){
        return this.usersService.findOne(parseInt(id));
    }

    @Get()
    findAllUsers(@Query("email") email:string){
        return this.usersService.find(email)
    }

    @Delete()
    deleteUser(@Body("id") id:string){
        return this.usersService.delete(parseInt(id))
    }

    @Patch("/:id")
    updateUser(@Param("id") id:string, @Body() body:UpdateUserDto){
        return this.usersService.update(parseInt(id),body)
    }
}
