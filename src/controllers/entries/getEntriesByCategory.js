const {getDB} = require("../../database/db");

async function getEntriesByCategory (req,res) {
    try{

        const {category} = req.params;
        
        const connect = await getDB();

        const [entries] = await connect.query(
            `
                SELECT u.user_name, u.avatar, e.title, CONCAT(SUBSTRING(e.content,1,50),"...") AS content,e.category, e.create_date
                FROM entries e
                INNER JOIN users u ON u.id=e.user_id
                WHERE category =?
            `,
            [category]
        );

        entries.sort((a, b) => new Date(b.create_date) - new Date(a.create_date));

        if(!entries.length){
            return res.status(404).send({
                status: 'Not Found',
                message: 'No hay entradas para mostrar'
            });
        }

        connect.release();
        
        return res.status(200).send({
            status: "OK",
            data: entries
        });

    } catch(e){
        console.log(e)
    }
}

module.exports = getEntriesByCategory;