#!/bin/bash

Usuario="$(logname)"         #Consigue el nombre del usuario que ejecuta el script
Grupo="$(id -gn "$Usuario")" #Consigue el grupo del usuario que ejecuta el script
#IMPORTAMOS LOS SCRIPTS PARA PODER USAR SUS FUNCIONES
source /home/triaxis/PROYECTO/scripts/usuarios.sh
source /home/triaxis/PROYECTO/scripts/grupos.sh
source /home/triaxis/PROYECTO/scripts/respaldos.sh
source /home/triaxis/PROYECTO/scripts/firewall.sh
source /home/triaxis/PROYECTO/scripts/logs.sh
source /home/triaxis/PROYECTO/scripts/red.sh

echo "¡Bienvenido al menú de gestión!"
echo "Ingrese que quiere hacer:"
opc=100
while [ $opc -ne 0 ]; do
	echo "1) Gestión de usuarios"
	echo "2) Gestión de grupos"
	echo "3) Gestión de respaldos"
	echo "4) Gestión de Firewall"
	echo "5) Gestión de Logs"
	echo "6) Gestión de redes"
	echo "0) Salir"
	read -p "Ingrese su opción: " opc
	case $opc in
	1)
		if [ "$Grupo" = "wheel" ]; then
			echo "Ha ingresado a la gestión de usuarios"
			echo "¿Que va a hacer?"
			opc2=4
			while [ $opc2 -ne 0 ]; do
				read -p "1) Crear usuario | 2) Borrar un usuario | 3) Modificar un usuario | 0) Salir: " opc2
				case $opc2 in
				1)
					crearUsuario
					;;
				2)
					borrarUsuario
					;;
				3)
					modificarUsuario
					;;
				0)
					echo "Saliendo..."
					;;
				*)
					echo "Opción no válida"
					;;
				esac
			done
		else
			echo "No tiene permisos para gestionar usuarios"
		fi
		;;
	2)
		if [ "$Grupo" = "wheel" ]; then
			echo "Ha ingresado a la creación de grupos"
			echo "¿Qué va a hacer?"
			opc3=4
			while [ $opc3 -ne 0 ]; do
				read -p "1) Crear un grupo | 2) Borrar un grupo | 3) Modificar un grupo | 0) Salir: " opc3
				case $opc3 in
				1)
					crearGrupo
					;;
				2)
					borrarGrupo
					;;
				3)
					modificarGrupo
					;;
				0)
					echo "Saliendo..."
					;;
				*)
					echo "Opción no válida"
					;;
				esac
			done
		else
			echo "No tiene permisos para gestionar grupos"
		fi
		;;
	3)
		if [[ "$Grupo" = "wheel" || "$Grupo" = "respaldos" ]]; then
			echo "Ha ingresado a la gestión de respaldos"
			opc4=3
			while [ "$opc4" -ne 0 ]; do
				read -p "Ingrese que quiere hacer: 1- Local | 2-Remoto | 0-Salir: " opc4
				case $opc4 in
				1)
					respaldoLocal
					;;
				2)
					respaldoRemoto
					;;
				0)
					echo "Saliendo a home..."
					;;
				*)
					echo "Opcion no valida"
					;;
				esac
			done
		else
			echo "No tiene permisos para gestionar respaldos"
		fi
		;;
	4)
		if [[ "$Grupo" = "wheel" || "$Grupo" = "firewallYnmtui" ]]; then
			echo "Ha ingresado a la gestión de Firewall"
			opc5=3
			while [ "$opc5" -ne 0 ]; do
				echo "Ingrese que quiere hacer"
				echo "1- Bloquear y/o desbloquear puertos"
				echo "2- Bloquear y/o desbloquear una ip"
				echo "3- Bloquear y/o desbloquear una ip y un puerto"
				echo "0- Salir"
				read -p "Ingrese su opción: " opc5
				case $opc5 in
				1)
					bloquearPuertos
					;;
				2)
					bloquearIP
					;;
				3)
					bloquearIPyPuerto
					;;
				0)
					echo "Saliendo a home..."
					;;
				*)
					echo "Opcion no valida"
					;;
				esac
			done
		else
			echo "No tiene permisos para gestionar Firewall"
		fi
		;;
	5)
		if [ "$Grupo" = "wheel" ]; then
			echo "Ha ingresado a la gestión de Logs"
			logs
		else
			echo "No tiene permisos para gestionar Logs"
		fi
		;;
	6)
		if [[ "$Grupo" = "wheel" || "$Grupo" = "firewallYnmtui" ]]; then
			echo "Ha ingresado a la gestión de redes"
			red
		else
			echo "No tiene permisos para gestionar redes"
		fi
		;;
	0)
		echo "Saliendo a home..."
		;;
	*)
		echo "Opción no válida"
		;;
	esac
done
