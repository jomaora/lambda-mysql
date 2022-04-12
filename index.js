const mysql = require('mysql2/promise');
module.exports.handler = async (event, context, callback) => {
  try {
    const con = await mysql.createConnection({
      host: process.env.NODE_ENV === 'development' ? 'localhost': 'poc-review-lambda-1.cluster-cbshp9jla1xz.eu-west-1.rds.amazonaws.com',
      database: process.env.NODE_ENV === 'development' ? 'ReviewMode': 'ReviewMode',
      user: process.env.NODE_ENV === 'development' ? 'admin': 'admin',
      password: process.env.NODE_ENV === 'development' ? 'password': 'admin123',
      port: 3306
    });
  
    const query = `SELECT cs.skillRef, count(*) AS slidesToReview
          FROM slides AS s 
          INNER JOIN 
            content_skills AS cs ON s.chapterRef = cs.chapterRef
          INNER JOIN 
            review_user_slides AS rus ON s.slideId = rus.slideId
          WHERE s.eligible = TRUE
          AND s.hidden = FALSE
          AND rus.userId = 'tom'
          AND rus.recallDate < NOW()
          GROUP BY cs.skillRef
          HAVING slidesToReview >= 5`;
  
    const [result] = await con.query(query);
    console.log(result)
  
    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
    };
    callback(null, response);
  } catch (err) {
    console.log(err);
    callback(err);
  } finally {
    con.end();
  }
};