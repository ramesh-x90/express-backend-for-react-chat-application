

import sys
import time
import socket
import threading


def client_connection(conn: socket.socket):
    buffer = 1024*5

    try:
        while conn:
            msg = conn.recv(buffer).decode()
            print(msg)
            conn.sendall("hello".encode())

    except Exception as e:
        print('Client left')


HOST = 'localhost'
PORT = 6000


sock = socket.socket()

try:
    sock.bind((HOST, PORT))
except Exception as e:
    print("ERROR := " + str(e))
    exit()
time.sleep(0.2)
print("\r[+] server socket binding successed" + 10*" ", end='')

sock.listen()
print(f"\r[+] listing to port: {HOST}:{PORT}")


while True:
    conn, address = sock.accept()

    print(f"[+] Address: { address[0]}:{address[1]}")

    t2 = threading.Thread(target=(client_connection), args=(conn, ))
    t2.start()
