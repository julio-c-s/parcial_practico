/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString} from 'class-validator';
export class ClubDto {
    @IsString()
    @IsNotEmpty({ message: 'The name field is required.' })
    readonly name: string;

    @IsString()
    @IsNotEmpty({ message: 'The foundationDate field is required.' })
    readonly foundationDate: string;

    @IsString()
    @IsNotEmpty({ message: 'The description field is required.' })
    readonly description: string;

    @IsString()
    @IsNotEmpty({ message: 'The image field is required.' })
    readonly image: string;
}