<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>profesores</v-toolbar-title>
                    <v-divider
                    class="mx-2"
                    inset
                    vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <v-btn slot="activator" color="primary" dark class="mb-2">New</v-btn>
                        <v-card>
                            <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                            </v-card-title>
                
                            <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="username" label="Username">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-select v-model="email" label="Email">
                                    </v-select>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="name" label="Name">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="lastname" label="Last Name">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="dni" label="DNI">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="phone" label="Phone">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="birthday" label="Birthday">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="address" label="Address">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="creditHours" label="Credit">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12 v-show="valida">
                                    <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                                    </div>
                                </v-flex>
                                </v-layout>
                            </v-container>
                            </v-card-text>
                
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                                <v-btn color="blue darken-1" flat @click.native="guardar">Save</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="profesores"
                :search="search"
                class="elevation-1"
            >
                <template slot="items" slot-scope="props">
                    <td class="justify-center layout px-0">
                        <v-icon
                        small
                        class="mr-2"
                        @click="editItem(props.item)"
                        >
                        edit
                        </v-icon>
                    </td>
                    <td>{{ props.item.username }}</td>
                    <td>{{ props.item.email }}</td>
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.lastname }}</td>
                    <td>{{ props.item.dni }}</td>
                    <td>{{ props.item.phone }}</td>
                    <td>{{ props.item.birthday }}</td>
                    <td>{{ props.item.address }}</td>
                    <td>{{ props.item.creditHours }}</td>
                </template>
                <template slot="no-data">
                <v-btn color="primary" @click="listar">Reset</v-btn>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>
<script>
    import axios from 'axios'
    export default {
        data(){
            return {
                profesores:[],                
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Username', value: 'username', sortable: false},
                    { text: 'Email', value: 'email', sortable: false  } ,
                    { text: 'Name', value: 'name' },
                    { text: 'Last Name', value: 'lastname' },
                    { text: 'DNI', value: 'dni', sortable: false },
                    { text: 'Phone', value: 'phone' },
                    { text: 'Birthday', value: 'birthday', sortable: false  },
                    { text: 'Address', value: 'address', sortable: false  },
                    { text: 'Credit', value: 'creditHours', sortable: false  }          
                ],
                search: '',
                editedIndex: -1,
                id: '',
                username: '',
                email: '',
                name: '',
                lastname: '',
                dni: '',
                phone: '',
                birthday: '',
                address: '',
                creditHours: '',
                valida: 0,
                validaMensaje:[],
                adModal: 0,
                adAccion: 0,
                adNombre: '',
                adId: ''             
            }
        },
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'New Profesor' : 'Update Profesor'
            }
        },

        watch: {
            dialog (val) {
            val || this.close()
            }
        },

        created () {
            this.listar();
        },
        methods:{
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('/api/users/teachers',configuracion).then(function(response){
                    //console.log(response);
                    me.profesores=response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            editItem (item) {
                this.id=item.idpersona;
                this.username=item.username;
                this.email=item.email;
                this.name=item.name;
                this.lastname=item.lastname;
                this.dni=item.dni;
                this.phone=item.phone;
                this.birthday=item.birthday;
                this.address=item.birthday;
                this.creditHours=item.creditHours;
                this.editedIndex=1;
                this.dialog = true
            },
            close () {
                this.dialog = false;
                this.limpiar();
            },
            limpiar(){
                this.id="";
                this.username="";
                this.email="";
                this.name="";
                this.lastname="";
                this.dni="";
                this.phone="";
                this.birthday="";
                this.address="";
                this.creditHours="";
                this.editedIndex=-1;
            },
            guardar () {
                if (this.validar()){
                    return;
                }
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                if (this.editedIndex > -1) {
                    //Código para editar
                    let me=this;
                    axios.put('/api/users/teachers' + me.id,{
                        'username': me.username,
                        'password': me.password,
                        'email': me.email,
                        'name': me.name,
                        'lastname': me.lastname,
                        'dni': me.dni,
                        'phone': me.phone,
                        'birthday': me.birthday,                    
                        'address': me.address,
                        'totalStart': me.totalStart,
                        'active': me.active,
                        'linkedin': me.linkedin
                    },configuracion).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();                        
                    }).catch(function(error){
                        console.log(error);
                    });
                } else {
                    //Código para guardar
                    let me=this;
                    axios.post('',{
                        'username': me.username,
                        'password': me.password,
                        'email': me.email,
                        'name': me.name,
                        'lastname': me.lastname,
                        'dni': me.dni,
                        'phone': me.phone,
                        'birthday': me.birthday,                    
                        'address': me.address,
                        'totalStart': me.totalStart,
                        'active': me.active,
                        'linkedin': me.linkedin
                    },configuracion).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();                        
                    }).catch(function(error){
                        console.log(error);
                    });
                }
            },
            validar(){
                this.valida=0;
                this.validaMensaje=[];

                if (this.nombre.length<3 || this.nombre.length>100){
                    this.validaMensaje.push("El nombre debe tener más de 3 caracteres y menos de 100 caracteres.");
                }                
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            }
        }        
    }
</script>
