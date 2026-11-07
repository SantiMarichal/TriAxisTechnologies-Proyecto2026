#!/bin/bash

bloquearPuertos() {
	echo "Ha ingresado a la opcion 1: "
	echo "¿Va a bloquear o desbloquear un puerto?"
	echo "1- Desbloquear"
	echo "2- Bloquear"
	echo "0- Volver"
	opc1=3
	read -p "Ingrese su opción: " opc1
	while [ "$opc1" -ne 0 ]; do
		case $opc1 in
		1)
			echo "Ha ingresado la opcion 1: "
			read -p "¿Quiere que sea permanente o temporal? 1- Permanente / 2- Temporal / 0- Volver: " opc2
			while [ "$opc2" -ne 0 ]; do
				case $opc2 in
				1)
					echo "Ha ingresado la opcion 1: "
					read -p "¿Quiere desbloquear un rango de puertos o solo un puerto? (1- Rango / 2- Solo un puerto / 0- Volver): " opc3
					while [[ "$opc3" -ne 0 ]]; do
						case $opc3 in
						1)
							read -p "Ingrese el puerto inicial: " puerto_inicial
							read -p "Ingrese el puerto final: " puerto_final
							read -p "Ingrese el protocolo (tcp/udp): " protocolo
							if sudo firewall-cmd --add-port="$puerto_inicial"-"$puerto_final"/"$protocolo" --permanent; then
								sudo firewall-cmd --reload
								echo "Rango de puertos desbloqueado correctamente"
							else
								echo "Error al desbloquear el rango de puertos"
							fi
							;;
						2)
							read -p "Ingrese el puerto a desbloquear: " puerto
							read -p "Ingrese el protocolo (tcp/udp): " protocolo
							if sudo firewall-cmd --add-port="$puerto"/"$protocolo" --permanent; then
								sudo firewall-cmd --reload
								echo "Puerto desbloqueado correctamente"
							else
								echo "Error al desbloquear el puerto"
							fi
							;;
						0)
							echo "Volviendo..."
							;;
						*)
							echo "Opcion no valida"
							;;
						esac
						read -p "¿Quiere desbloquear un rango de puertos o solo un puerto? (1- Rango / 2- Solo un puerto / 0- Volver): " opc3
					done
					;;
				2)
					echo "Ha ingresado la opcion 2: "
					read -p "¿Quiere desbloquear un rango de puertos o solo un puerto? (1- Rango / 2- Solo un puerto / 0- Volver): " opc4
					while [[ "$opc4" -ne 0 ]]; do
						case $opc4 in
						1)
							read -p "Ingrese el puerto inicial: " puerto_inicial
							read -p "Ingrese el puerto final: " puerto_final
							read -p "Ingrese el protocolo (tcp/udp): " protocolo
							if sudo firewall-cmd --add-port="$puerto_inicial"-"$puerto_final"/"$protocolo"; then
								echo "Rango de puertos desbloqueado correctamente."
							else
								echo "Error al desbloquear el rango de puertos."
							fi
							;;
						2)
							read -p "Ingrese el puerto a desbloquear: " puerto
							read -p "Ingrese el protocolo (tcp/udp): " protocolo
							if sudo firewall-cmd --add-port="$puerto"/"$protocolo"; then
								echo "Puerto desbloqueado correctamente."
							else
								echo "Error al desbloquear el puerto."
							fi
							;;
						0)
							echo "Volviendo..."
							;;
						*)
							echo "Opcion no valida"
							;;
						esac
						read -p "¿Quiere desbloquear un rango de puertos o solo un puerto? (1- Rango / 2- Solo un puerto / 0- Volver): " opc4
					done
					;;
				0)
					echo "Volviendo..."
					;;
				*)
					echo "Opcion no valida"
					;;
				esac
				read -p "¿Quiere que sea permanente o temporal? 1- Permanente / 2- Temporal / 0- Volver: " opc2
			done
			;;
		2)
			echo "Ha ingresado la opcion 2: "
			read -p "¿Quiere que sea permanente o temporal? 1- Permanente / 2- Temporal / 0- Volver: " opc5
			while [ "$opc5" -ne 0 ]; do
				case $opc5 in
				1)
					echo "Ha ingresado la opcion 1: "
					read -p "¿Quiere bloquear un rango de puertos o solo un puerto? (1- Rango / 2- Solo un puerto / 0- Volver): " opc6
					while [[ "$opc6" -ne 0 ]]; do
						case $opc6 in
						1)
							read -p "Ingrese el puerto inicial: " puerto_inicial
							read -p "Ingrese el puerto final: " puerto_final
							read -p "Ingrese el protocolo (tcp/udp): " protocolo
							if sudo firewall-cmd --remove-port="$puerto_inicial"-"$puerto_final"/"$protocolo" --permanent; then
								sudo firewall-cmd --reload
								echo "Rango de puertos bloqueado correctamente"
							else
								echo "Error al bloquear el rango de puertos"
							fi
							;;
						2)
							read -p "Ingrese el puerto a bloquear: " puerto
							read -p "Ingrese el protocolo (tcp/udp): " protocolo
							if sudo firewall-cmd --remove-port="$puerto"/"$protocolo" --permanent; then
								sudo firewall-cmd --reload
								echo "Puerto bloqueado correctamente"
							else
								echo "Error al bloquear el puerto"
							fi
							;;
						0)
							echo "Volviendo..."
							;;
						*)
							echo "Opcion no valida"
							;;
						esac
						read -p "¿Quiere bloquear un rango de puertos o solo un puerto? (1- Rango / 2- Solo un puerto / 0- Volver): " opc6
					done
					;;
				2)
					echo "Ha ingresado la opcion 2: "
					read -p "¿Quiere bloquear un rango de puertos o solo un puerto? (1- Rango / 2- Solo un puerto / 0- Volver): " opc7
					while [[ "$opc7" -ne 0 ]]; do
						case $opc7 in
						1)
							read -p "Ingrese el puerto inicial: " puerto_inicial
							read -p "Ingrese el puerto final: " puerto_final
							read -p "Ingrese el protocolo (tcp/udp): " protocolo
							if sudo firewall-cmd --remove-port="$puerto_inicial"-"$puerto_final"/"$protocolo"; then
								echo "Rango de puertos bloqueado correctamente."
							else
								echo "Error al bloquear el rango de puertos."
							fi
							;;
						2)
							read -p "Ingrese el puerto a bloquear: " puerto
							read -p "Ingrese el protocolo (tcp/udp): " protocolo
							if sudo firewall-cmd --remove-port="$puerto"/"$protocolo"; then
								echo "Puerto bloqueado correctamente."
							else
								echo "Error al bloquear el puerto."
							fi
							;;
						0)
							echo "Volviendo..."
							;;
						*)
							echo "Opcion no valida"
							;;
						esac
						read -p "¿Quiere bloquear un rango de puertos o solo un puerto? (1- Rango / 2- Solo un puerto / 0- Volver): " opc7
					done
					;;
				0)
					echo "Volviendo..."
					;;
				*)
					echo "Opcion no valida"
					;;
				esac
				read -p "¿Quiere que sea permanente o temporal? 1- Permanente / 2- Temporal / 0- Volver: " opc5
			done
			;;
		0)
			echo "Volviendo..."
			;;
		*)
			echo "Opcion no valida"
			;;
		esac
		read -p "Ingrese su opción: " opc1
	done
}

bloquearIP() {
	echo "Ha ingresado a la opcion 2: "
	echo "¿Va a bloquear o desbloquear una ip?"
	echo "1- Bloquear"
	echo "2- Desbloquear"
	echo "0- Volver"
	opc8=3
	read -p "Ingrese su opción: " opc8
	while [ "$opc8" -ne 0 ]; do
		case $opc8 in
		1)
			echo "Ha ingresado la opcion 1: "
			read -p "¿Quiere que sea permanente o temporal? 1- Permanente / 2- Temporal / 0- Volver: " opc9
			while [[ "$opc9" -ne 0 ]]; do
				case $opc9 in
				1)
					echo "Ha ingresado la opcion 1: "
					read -p "Ingrese la ip a bloquear: " ip
					if sudo firewall-cmd --permanent --add-rich-rule="rule family='ipv4' source address='$ip' reject"; then
						sudo firewall-cmd --reload
						echo "IP bloqueada correctamente."
					else
						echo "Error al bloquear la IP."
					fi
					;;
				2)
					echo "Ha ingresado la opcion 2: "
					read -p "Ingrese la ip a bloquear: " ip
					if sudo firewall-cmd --add-rich-rule="rule family='ipv4' source address='$ip' reject"; then
						echo "IP bloqueada correctamente."
					else
						echo "Error al bloquear la IP."
					fi
					;;
				0)
					echo "Volviendo..."
					;;
				*)
					echo "Opcion no valida"
					;;
				esac
				read -p "¿Quiere que sea permanente o temporal? 1- Permanente / 2- Temporal / 0- Volver: " opc9
			done
			;;
		2)
			echo "Ha ingresado la opcion 2: "
			read -p "¿Quiere que sea permanente o temporal? 1- Permanente / 2- Temporal / 0- Volver: " opc10
			while [[ "$opc10" -ne 0 ]]; do
				case $opc10 in
				1)
					echo "Ha ingresado la opcion 1: "
					read -p "Ingrese la ip a desbloquear: " ip
					if sudo firewall-cmd --permanent --remove-rich-rule="rule family='ipv4' source address='$ip' reject"; then
						sudo firewall-cmd --reload
						echo "IP desbloqueada correctamente."
					else
						echo "Error al desbloquear la IP."
					fi
					;;
				2)
					echo "Ha ingresado la opcion 2: "
					read -p "Ingrese la ip a desbloquear: " ip
					if sudo firewall-cmd --remove-rich-rule="rule family='ipv4' source address='$ip' reject"; then
						echo "IP desbloqueada correctamente."
					else
						echo "Error al desbloquear la IP."
					fi
					;;
				0)
					echo "Volviendo..."
					;;
				*)
					echo "Opcion no valida"
					;;
				esac
				read -p "¿Quiere que sea permanente o temporal? 1- Permanente / 2- Temporal / 0- Volver: " opc10
			done
			;;
		0)
			echo "Volviendo..."
			;;
		*)
			echo "Opcion no valida"
			;;
		esac
		read -p "Ingrese su opción: " opc8
	done
}

bloquearIPyPuerto() {
	echo "Ha ingresado la opcion 3: "
	read -p "¿Va a bloquear o desbloquear una ip y puerto? 1- Bloquear / 2- Desbloquear / 0- Volver: " opc11
	while [[ "$opc11" -ne 0 ]]; do
		case $opc11 in
		1)
			read -p "¿Quiere que sea permanente o temporal? 1- Permanente / 2- Temporal / 0- Volver: " opc12
			while [[ "$opc12" -ne 0 ]]; do
				case $opc12 in
				1)
					echo "Ha ingresado la opcion 1 (Permanente): "
					read -p "Ingrese la IP a bloquear: " ip
					read -p "Ingrese el puerto a bloquear: " puerto
					read -p "Ingrese el protocolo (tcp/udp): " protocolo
					if sudo firewall-cmd --permanent --add-rich-rule="rule family='ipv4' source address='$ip' port protocol='$protocolo' port='$puerto' reject"; then
						sudo firewall-cmd --reload
						echo "IP y puerto bloqueados correctamente."
					else
						echo "Error al bloquear la IP y puerto."
					fi
					;;
				2)
					echo "Ha ingresado la opcion 2 (Temporal): "
					read -p "Ingrese la IP a bloquear: " ip
					read -p "Ingrese el puerto a bloquear: " puerto
					read -p "Ingrese el protocolo (tcp/udp): " protocolo
					if sudo firewall-cmd --add-rich-rule="rule family='ipv4' source address='$ip' port protocol='$protocolo' port='$puerto' reject"; then
						echo "IP y puerto bloqueados correctamente."
					else
						echo "Error al bloquear la IP y puerto."
					fi
					;;
				0)
					echo "Volviendo..."
					;;
				*)
					echo "Opcion no valida"
					;;
				esac
				read -p "¿Quiere que sea permanente o temporal? 1- Permanente / 2- Temporal / 0- Volver: " opc12
			done
			;;
		2)
			read -p "¿Quiere que sea permanente o temporal? 1- Permanente / 2- Temporal / 0- Volver: " opc13
			while [[ "$opc13" -ne 0 ]]; do
				case $opc13 in
				1)
					echo "Ha ingresado la opcion 1 (Permanente): "
					read -p "Ingrese la IP a desbloquear: " ip
					read -p "Ingrese el puerto a desbloquear: " puerto
					read -p "Ingrese el protocolo (tcp/udp): " protocolo
					if sudo firewall-cmd --permanent --remove-rich-rule="rule family='ipv4' source address='$ip' port protocol='$protocolo' port='$puerto' reject"; then
						sudo firewall-cmd --reload
						echo "IP y puerto desbloqueados correctamente."
					else
						echo "Error al desbloquear la IP y puerto."
					fi
					;;
				2)
					echo "Ha ingresado la opcion 2 (Temporal): "
					read -p "Ingrese la IP a desbloquear: " ip
					read -p "Ingrese el puerto a desbloquear: " puerto
					read -p "Ingrese el protocolo (tcp/udp): " protocolo
					if sudo firewall-cmd --remove-rich-rule="rule family='ipv4' source address='$ip' port protocol='$protocolo' port='$puerto' reject"; then
						echo "IP y puerto desbloqueados correctamente."
					else
						echo "Error al desbloquear la IP y puerto."
					fi
					;;
				0)
					echo "Volviendo..."
					;;
				*)
					echo "Opcion no valida"
					;;
				esac
				read -p "¿Quiere que sea permanente o temporal? 1- Permanente / 2- Temporal / 0- Volver: " opc13
			done
			;;
		0)
			echo "Volviendo..."
			;;
		*)
			echo "Opcion no valida"
			;;
		esac
		read -p "¿Va a bloquear o desbloquear una ip y puerto? 1- Bloquear / 2- Desbloquear / 0- Volver: " opc11
	done
}
