export interface Vector
{
    x: number;
    y: number;
}

export function vector(vec: Vector): Vector
{
    return { x: vec.x, y: vec.y };
}

export function perpendicular(vec: Vector) {
    const tmp = vec.x;
    vec.x = vec.y;
    vec.y = -tmp;
    return vec;
}

export function dot(vec1: Vector, vec2: Vector) {
    return vec1.x * vec2.x + vec1.y * vec2.y;
}

export function distance(vec1: Vector, vec2: Vector) {
    return Math.sqrt(Math.pow(vec1.x - vec2.x, 2) + Math.pow(vec1.y - vec2.y, 2));
}

export function set(vec1: Vector, vec2: Vector)
{
    vec1.x = vec2.x;
    vec1.y = vec2.y;
    return vec1;
}

export function add(vec1: Vector, vec2: Vector, m: number = 1)
{
    vec1.x += vec2.x * m;
    vec1.y += vec2.y * m;
    return vec1;
}

export function sub(vec1: Vector, vec2: Vector)
{
    vec1.x -= vec2.x;
    vec1.y -= vec2.y;
    return vec1;
}

export function len(vec: Vector)
{
    return Math.sqrt(Math.pow(vec.x,2) + Math.pow(vec.y,2));
}

export function scale(vec: Vector, f: number)
{
    vec.x *= f;
    vec.y *= f;
    return vec;
}

export function normalize(vec: Vector) {
    const d = (Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2)));
    if (d === 0) {
        vec.x = 1;
        vec.y = 0;
    } else {
        vec.x /= d;
        vec.y /= d;
    }

    return vec;
}