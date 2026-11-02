import React, { Component } from 'react';
import { 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TextField, 
  Button, 
  Box, 
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productos: [],
      recuperado: false,
      nuevoCodigo: '',
      nuevaDescripcion: '',
      nuevoPrecio: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.agregarProducto = this.agregarProducto.bind(this);
  }

  componentDidMount() {
    fetch('http://localhost:8000/api/producto/')
      .then((response) => response.json())
      .then((prod) => {
        this.setState({
          productos: prod,
          recuperado: true
        });
      })
      .catch((error) => console.error('Error al recuperar datos:', error));
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  agregarProducto(event) {
    event.preventDefault();

    const nuevoProd = {
      codigo: parseInt(this.state.nuevoCodigo),
      descripcion: this.state.nuevaDescripcion,
      precio: parseFloat(this.state.nuevoPrecio)
    };

    fetch('http://localhost:8000/api/producto/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoProd)
    })
      .then((res) => res.json())
      .then((productoGuardado) => {
        this.setState((prevState) => ({
          productos: [...prevState.productos, productoGuardado],
          nuevoCodigo: '',
          nuevaDescripcion: '',
          nuevoPrecio: ''
        }));
      })
      .catch((error) => console.error('Error al guardar producto:', error));
  }

  mostrarTabla() {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          Gestión de Productos (Material-UI)
        </Typography>

        {/* Formulario de Registro */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom color="secondary">
            Agregar Nuevo Producto
          </Typography>
          <Box 
            component="form" 
            onSubmit={this.agregarProducto} 
            sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}
          >
            <TextField
              label="Código"
              name="nuevoCodigo"
              type="number"
              value={this.state.nuevoCodigo}
              onChange={this.handleChange}
              required
              size="small"
            />
            <TextField
              label="Descripción"
              name="nuevaDescripcion"
              value={this.state.nuevaDescripcion}
              onChange={this.handleChange}
              required
              size="small"
              sx={{ flexGrow: 1 }}
            />
            <TextField
              label="Precio ($)"
              name="nuevoPrecio"
              type="number"
              step="0.01"
              value={this.state.nuevoPrecio}
              onChange={this.handleChange}
              required
              size="small"
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
            >
              Agregar
            </Button>
          </Box>
        </Paper>

        {/* Tabla de Productos con Material-UI */}
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: '#1976d2' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Código</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Precio ($)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.productos.map((prod) => (
                <TableRow key={prod.codigo} hover>
                  <TableCell>{prod.codigo}</TableCell>
                  <TableCell>{prod.descripcion}</TableCell>
                  <TableCell>
                    {typeof prod.precio === 'number' ? prod.precio.toFixed(2) : prod.precio}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  }

  render() {
    if (this.state.recuperado) {
      return this.mostrarTabla();
    } else {
      return (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="100vh"
        >
          <CircularProgress sx={{ mb: 2 }} />
          <Alert severity="info">Recuperando datos del servidor Django...</Alert>
        </Box>
      );
    }
  }
}

export default App;