#!/bin/bash
crearUsuario() {
	read -p "Ingrese el nombre del usuario que va a ser creado: " nombreUsuarioCrear
	if id "$nombreUsuarioCrear" &>/dev/null; then
		#/dev/null permite que todo lo que se envie ahi desaparezca | #&> permite enviar salidas exitosas y errores
		echo "Desgraciadamente ya existe un usuario con ese nombre, elija otro por favor."
	else
		sudo useradd -d /home/PROYECTO/Usuarios/$nombreUsuarioCrear -m -s /bin/bash $nombreUsuarioCrear
		echo "Usuario creado correctamente."
	fi
}
borrarUsuario() {
	read -p "Ingrese el nombre del usuario a quien quiere borrar: " nombreUsuarioBorrar
	if id "$nombreUsuarioBorrar" &>/dev/null; then
		sudo userdel -r $nombreUsuarioBorrar
		echo "Usuario borrado correctamente." #Se debe borrar el grupo al que pertenecia el usuario?
	else
		echo "No existe ese nombre de usuario."
	fi
}
modificarUsuario() {
	echo "¿Que quiere hacer?"
	opc5=3
	while [ $opc5 -ne 0 ]; do
		read -p "1- Modificar nombre de usuario. | 2- Modificar grupo del usuario. | 0- Salir: " opc5
		case $opc5 in
		1)
			read -p "Ingrese el nombre del usuario actual: " nombreUsuarioAnterior
			read -p "Ingrese el nombre del usuario nuevo: " nombreUsuarioNuevo
			if id "$nombreUsuarioNuevo" &>/dev/null; then
				echo "Ese nombre de usuario ya existe."
			else
				if id "$nombreUsuarioAnterior" &>/dev/null; then
					sudo usermod -l $nombreUsuarioNuevo $nombreUsuarioAnterior
					echo "Usuario modificado correctamente."
				else
					echo "El nombre de usuario anterior no existe."
				fi
			fi
			;;
		2)
			read -p "Ingrese el nombre del usuario a modificar su grupo: " usuario
			read -p "Ingrese el nombre de su nuevo grupo: " nuevoGrupo
			if id "$usuario" &>/dev/null; then
				if getent group "$nuevoGrupo" &>/dev/null; then
					sudo usermod -g "$nuevoGrupo" "$usuario"
					echo "Su grupo ha cambiado."
				else
					echo "Ese grupo no existe."
				fi
			else
				echo "Ese usuario no existe."
			fi
			;;
		0)
			echo "Saliendo..."
			;;
		*)
			echo "Opción no valida."
			;;
		esac
	done
}
