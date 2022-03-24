const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const req = require('express/lib/request');
const { response } = require('express');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb+srv://juan1:Juanantonio@todos.7hglo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Conexión a la base de datos exitosa');
});

connection.on('error', (err) => {
    console.log('Error en la conexión a la BD: ', err);
});

//Modelo
const Todo = mongoose.model('Todo', { text: String, completed: Boolean });

app.post('/add', (req, res) => {
    //req.body.text es el nombre del campo de texto dentro del HTML
    const todo = new Todo({ text: req.body.text, completed: false });

    todo.save()
        .then(doc => {
            console.log('Dato insertado correctamente', doc);
            res.redirect('/');
            //res.json({ response: 'success' });
        })
        .catch(err => {
            console.log("Error al insertar", err.message);
            res.status(400).json({ response: 'failed' });
        });
});

app.get('/getall', (req, res) => {
    Todo.find({}, 'text completed') //Para poder filtrar los datos por estos campos
        .then(doc => {
            res.json({ response: 'success', data: doc })

        })
        .catch(err => {
            console.log("Error al consultar elementos", err.message);
            res.status(400).json({ response: 'failed' });
        });
})

app.get('/complete/:id/:status', (req, res) => {
    const id = req.params.id;
    const status = req.params.status == 'true'; //Convertir a booleano

    Todo.findByIdAndUpdate({ _id: id }, { $set: { completed: status } })
        .then(doc => {
            res.json({ response: 'success' });
        })
        .catch(err => {
            console.log('Error al actualizar el dato', err.message);
            res.status(400).json({ response: 'failed' });
        })
});

app.get('/delete/:id', (req, res) => {
    const id = req.params.id;

    Todo.findByIdAndDelete({ _id: id })
        .then(doc => {
            res.redirect('/');
            //res.json({ response: 'success' })
        })
        .catch(err => {
            console.log("Error al eliminar dato", err.message);
            res.status(400).json({ response: 'failed' })
        })
});

app.listen(3000, () => {
    console.log("Servidor iniciado.")
})