import { useState, useEffect, useRef } from 'react';
import { Button, Dialog, InputText, DataTable, Column, Card } from 'primereact';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { Toast } from 'primereact/toast';

const ManagePeople = () => {
  const [people, setPeople] = useState([]);
  const [cities, setCities] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    bi: '',
    email: '',
    endereco: '',
    cidade: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [personToDelete, setPersonToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const toastRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/pessoa/listar')
      .then(response => {
        setPeople(response.data);
      })
      .catch(error => {
        toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar pessoas: ' + error.message });
      });

    axios.get('http://localhost:8080/api/cidade/listar')
      .then(response => {
        setCities(response.data);
      })
      .catch(error => {
        toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar cidades: ' + error.message });
      });
  }, []);

  const handleAddPerson = () => {
    const updatedFormData = {
      ...formData,
      cidade: { id: formData.cidade },
    };

    if (isEditing) {
      axios.put('http://localhost:8080/api/pessoa/actualizar', updatedFormData)
        .then(response => {
          setPeople(people.map(person => person.id === formData.id ? response.data : person));
          setShowDialog(false);
          resetForm();
          toastRef.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Pessoa atualizado com sucesso!' });
        })
        .catch(error => {
          toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar pessoa: ' + error.message });
        });
    } else {
      axios.post('http://localhost:8080/api/pessoa/adicionar', updatedFormData)
        .then(response => {
          setPeople([...people, response.data]);
          setShowDialog(false);
          resetForm();
          toastRef.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Pessoa adicionada com sucesso!' });
        })
        .catch(error => {
          toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar pessoa: ' + error.message });
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditPerson = (personId) => {
    const person = people.find(p => p.id === personId);
    setFormData({
      ...person,
      cidade: person.cidade?.id || '',
    });
    setIsEditing(true);
    setShowDialog(true);
  };

  const handleDeletePerson = () => {
    axios.delete(`http://localhost:8080/api/pessoa/${personToDelete}`)
      .then(() => {
        setPeople(people.filter(person => person.id !== personToDelete));
        setShowDeleteDialog(false);
        toastRef.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Pessoa excluída com sucesso!' });
      })
      .catch(error => {
        toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar pessoa: ' + error.message });
        setShowDeleteDialog(false);
      });
  };

  const confirmDelete = (personId) => {
    setPersonToDelete(personId);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      nome: '',
      bi: '',
      email: '',
      endereco: '',
      cidade: '',
    });
    setIsEditing(false);
  };

  const filteredPeople = people.filter(person =>
    person.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'stretch', minHeight: '100vh', backgroundColor: '#f0f0f0', padding: '20px' }}>
      <Box sx={{ margin: '2 auto', width: '100%', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Card title="Pessoas" style={{ flex: 1, padding: '2rem', background: '#fff', borderRadius: '16px', boxShadow: '0 0.2px 0.2px rgba(0, 0, 0, 0.1)', height: '100%' }}>
          <Typography variant="h4" component="h2" gutterBottom style={{ marginBottom: '20px', textAlign: 'center' }}></Typography>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome"
              style={{ width: '300px', borderRadius: '8px', padding: '10px', background: '#f7f7f7', border: '1px solid #e0e0e0' }}
            />
          </div>

          <Button
            label="Adicionar Pessoa"
            icon="pi pi-plus"
            onClick={() => { resetForm(); setShowDialog(true); }}
            style={{ backgroundColor: '#ff4d94', borderColor: '#ff4d94', marginBottom: '20px', padding: '10px 20px' }}
          />

          <DataTable value={filteredPeople} paginator rows={10} responsiveLayout="scroll" style={{ width: '100%' }}>
            <Column field="nome" header="Nome" />
            <Column field="bi" header="BI" />
            <Column field="email" header="Email" />
            <Column field="endereco" header="Endereço" />
            <Column field="cidade.nome" header="Cidade" />
            <Column
              header="Ações"
              body={(rowData) => (
                <div>
                  <Button icon="pi pi-pencil" className="p-button-rounded p-button-text" onClick={() => handleEditPerson(rowData.id)} style={{ marginRight: '10px' }} />
                  <Button icon="pi pi-trash" className="p-button-rounded p-button-text" onClick={() => confirmDelete(rowData.id)} />
                </div>
              )}
            />
          </DataTable>
        </Card>

        <Dialog header={isEditing ? "Editar Pessoa" : "Adicionar Pessoa"} visible={showDialog} style={{ width: '50vw' }} onHide={() => setShowDialog(false)}>
          <div>
            <div className="p-field">
              <label htmlFor="nome">Nome</label>
              <InputText id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required style={{ width: '100%' }} />
            </div>
            <div className="p-field">
              <label htmlFor="bi">BI</label>
              <InputText id="bi" name="bi" value={formData.bi} onChange={handleInputChange} style={{ width: '100%' }} />
            </div>
            <div className="p-field">
              <label htmlFor="email">Email</label>
              <InputText id="email" name="email" value={formData.email} onChange={handleInputChange} style={{ width: '100%' }} />
            </div>
            <div className="p-field">
              <label htmlFor="endereco">Endereço</label>
              <InputText id="endereco" name="endereco" value={formData.endereco} onChange={handleInputChange} style={{ width: '100%' }} />
            </div>
            <div className="p-field">
              <label htmlFor="cidade">Cidade</label>
              <select
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', borderColor: '#e0e0e0' }}
              >
                <option value="">Selecione a cidade</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="p-dialog-footer">
            <Button label="Salvar" icon="pi pi-check" onClick={handleAddPerson} />
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowDialog(false)} className="p-button-secondary" />
          </div>
        </Dialog>

        <Dialog header="Confirmar Exclusão" visible={showDeleteDialog} style={{ width: '30vw' }} onHide={() => setShowDeleteDialog(false)}>
          <p>Tem certeza que deseja excluir esta pessoa?</p>
          <div className="p-dialog-footer">
            <Button label="Sim" icon="pi pi-check" onClick={handleDeletePerson} />
            <Button label="Não" icon="pi pi-times" onClick={() => setShowDeleteDialog(false)} className="p-button-secondary" />
          </div>
        </Dialog>
      </Box>
      <Toast ref={toastRef} />
    </Box>
  );
};

export default ManagePeople;
