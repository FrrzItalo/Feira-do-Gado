/**
 * FEIRA DO GADO - Lógica Principal
 * Inclui: Menu Mobile, Parallax, Mapa Interativo, Modais e Ofertas
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MENU MOBILE ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });

        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
            });
        });
    }

    // --- 2. EFEITO PARALLAX ---
    const heroImage = document.getElementById('heroImage');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (heroImage) {
            // Ajuste de velocidade (0.5) e escala para não mostrar bordas brancas
            heroImage.style.transform = `translateY(${scrolled * 0.5}px) scale(1.1)`;
        }
    });

    // --- 3. INTERAÇÃO COM O MAPA ---
    const states = document.querySelectorAll('.state');
    const stateData = {
        'SP': { name: 'São Paulo', animals: '3.240', sellers: '456', avgPrice: 'R$ 6.800', sales: '892' },
        'MG': { name: 'Minas Gerais', animals: '2.890', sellers: '398', avgPrice: 'R$ 6.200', sales: '756' },
        'GO': { name: 'Goiás', animals: '2.450', sellers: '312', avgPrice: 'R$ 5.900', sales: '623' },
        'MT': { name: 'Mato Grosso', animals: '3.120', sellers: '445', avgPrice: 'R$ 5.500', sales: '812' },
        'MS': { name: 'Mato Grosso do Sul', animals: '2.180', sellers: '287', avgPrice: 'R$ 5.800', sales: '534' },
        'BA': { name: 'Bahia', animals: '1.890', sellers: '234', avgPrice: 'R$ 5.400', sales: '445' },
        'PA': { name: 'Pará', animals: '1.560', sellers: '198', avgPrice: 'R$ 5.100', sales: '367' },
        'RS': { name: 'Rio Grande do Sul', animals: '1.340', sellers: '178', avgPrice: 'R$ 6.500', sales: '298' },
        'PR': { name: 'Paraná', animals: '1.120', sellers: '156', avgPrice: 'R$ 6.300', sales: '256' },
        'TO': { name: 'Tocantins', animals: '980', sellers: '134', avgPrice: 'R$ 5.200', sales: '212' }
    };

    states.forEach(state => {
        state.addEventListener('click', () => {
            states.forEach(s => s.classList.remove('selected'));
            state.classList.add('selected');
            
            const stateCode = state.getAttribute('data-state');
            const data = stateData[stateCode] || stateData['SP'];
            
            // Atualiza os textos na interface
            actualizarElemento('selectedStateName', data.name);
            actualizarElemento('animalsCount', data.animals);
            actualizarElemento('sellersCount', data.sellers);
            actualizarElemento('avgPrice', data.avgPrice);
            actualizarElemento('salesCount', data.sales);
            actualizarElemento('viewAnimalsBtn', `Ver animais em ${data.name}`);
        });
    });

    // Função auxiliar para evitar erros se o ID não existir
    function actualizarElemento(id, texto) {
        const el = document.getElementById(id);
        if (el) el.textContent = texto;
    }

    // --- 4. LÓGICA DE OFERTAS E MODAIS ---
    window.currentAnimal = '';
    window.currentPrice = 0;

    // Torna as funções globais para serem chamadas pelos botões no HTML
    window.openOfferModal = function(animal, price) {
        window.currentAnimal = animal;
        window.currentPrice = price;
        
        document.getElementById('offerAnimalName').textContent = animal;
        document.getElementById('offerAskingPrice').textContent = `R$ ${price.toLocaleString('pt-BR')}`;
        document.getElementById('offerInput').value = '';
        document.getElementById('offerComparison').textContent = '';
        
        const modal = document.getElementById('offerModal');
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeOfferModal = function() {
        const modal = document.getElementById('offerModal');
        if (modal) modal.classList.remove('open');
        document.body.style.overflow = '';
    };

    window.openSuccessModal = function(animal, price) {
        document.getElementById('successAnimalName').textContent = animal;
        document.getElementById('successPrice').textContent = `R$ ${price.toLocaleString('pt-BR')}`;
        
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeSuccessModal = function() {
        const modal = document.getElementById('successModal');
        if (modal) modal.classList.remove('open');
        document.body.style.overflow = '';
    };

    // Formatação de moeda em tempo real e comparação de preço
    window.formatOfferInput = function(input) {
        let value = input.value.replace(/\D/g, '');
        if (value) {
            value = (parseInt(value) / 100).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        input.value = value;
        
        const numericValue = parseFloat(input.value.replace(/\./g, '').replace(',', '.')) || 0;
        const comparison = document.getElementById('offerComparison');
        
        if (comparison && numericValue > 0) {
            const diff = ((numericValue - window.currentPrice) / window.currentPrice * 100).toFixed(1);
            if (diff > 0) {
                comparison.textContent = `+${diff}% acima do preço pedido`;
                comparison.style.color = '#1a472a'; // Verde escuro
            } else if (diff < 0) {
                comparison.textContent = `${diff}% abaixo do preço pedido`;
                comparison.style.color = '#8b6914'; // Marrom/Dourado
            } else {
                comparison.textContent = 'Igual ao preço pedido';
                comparison.style.color = '#666';
            }
        }
    };

    window.submitOffer = function() {
        const valor = document.getElementById('offerInput').value;
        if (!valor || valor === "0,00") {
            alert('Por favor, insira um valor para a oferta.');
            return;
        }
        window.closeOfferModal();
        alert(`Oferta de R$ ${valor} enviada com sucesso para ${window.currentAnimal}!`);
    };

    // --- 5. FECHAMENTO DE MODAIS (Overlay e Tecla ESC) ---
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.closeOfferModal();
            window.closeSuccessModal();
        }
    });

    // --- 6. SCROLL SUAVE PARA LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});