export class Post {
    private title: string
    private content: string
    private published: boolean
    private authorId: number

    constructor(title: string , content: string = "", published: boolean = false, authorId: number) {
        this.title = title
        this.content = content
        this.published = published
        this.authorId = authorId
    }
}