package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.dto.AuthRequestDTO;
import com.springboot.MyTodoList.dto.AuthResponseDTO;
import com.springboot.MyTodoList.model.Usuario;
import com.springboot.MyTodoList.security.JwtService;
import com.springboot.MyTodoList.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public AuthResponseDTO authenticate(AuthRequestDTO request) {
        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new BadCredentialsException("Usuario o contraseña incorrectos"));

                //credenciales hardcodeadas
                if ("prueba@oracle.com".equals(request.getCorreo()) && "12345".equals(request.getPassword())) {
                    return new AuthResponseDTO("dummy-token-SuperAdmin", usuario.getId(), usuario.getRol(), usuario.getNombreUsuario(), usuario.getCorreo());
                }

                if ("prueba1@oracle.com".equals(request.getCorreo()) && "12345".equals(request.getPassword())) {
                    return new AuthResponseDTO("dummy-token-dev", usuario.getId(), usuario.getRol(), usuario.getNombreUsuario(), usuario.getCorreo());
                }

                if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
                    throw new BadCredentialsException("Usuario o contraseña incorrectos");
                }

                String token = jwtService.generateToken(usuario.getCorreo());
                return new AuthResponseDTO(token, usuario.getId(), usuario.getRol(), usuario.getNombreUsuario(), usuario.getCorreo());
    }

}
