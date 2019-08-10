const Post = require('../models/Post')

module.exports = {
    async store(req, res) {
        console.log(req.file)

        const { originalname: name, size, key, location: url = "" } = req.file
        // Trona um nome pelo outro ----------->↑↑

        const post = await Post.create({
            name,
            size,
            key, 
            url
        })

        res.json(post)
    },

    async index(req, res) {
        const posts = await Post.find()

        return res.json(posts)
    },

    async delete(req, res){
        const post = await Post.findById(req.params.id)

        await post.remove()

        return res.send()
    }
}