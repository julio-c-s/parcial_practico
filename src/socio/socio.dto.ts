/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString, Matches} from 'class-validator';
export class SocioDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsString()
    @IsNotEmpty()
    readonly birthDate: Date;
    
    @IsString()
    @IsNotEmpty()
    readonly description: string;
    
    @IsString()
    @IsNotEmpty()
    @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    readonly email: string;
}
